document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("dpCanvas");
    const ctx = canvas.getContext("2d");
    const container = document.querySelector(".canvas-container");

    const uploadImage = document.getElementById("uploadImage");
    const roleSelect = document.getElementById("roleSelect");
    const zoomSlider = document.getElementById("zoomSlider");
    const downloadBtn = document.getElementById("downloadBtn");
    const shareBtn = document.getElementById("shareBtn");

    // Pre-declare image objects
    let uploadedImg = null;
    let frameImg = new Image();
    
    // Core Technical Constraint: 1080x1080 Canvas strictly
    const CANVAS_SIZE = 1080;

    // Image state for transformations
    let imgX = 0;
    let imgY = 0;
    let imgScale = 1;
    
    // Drag state
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // Load initial empty state
    draw();

    // STEP 1: Upload Image
    uploadImage.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImg = new Image();
                uploadedImg.onload = () => {
                    // Calculate initial scale to "cover" the canvas completely
                    const scaleX = CANVAS_SIZE / uploadedImg.width;
                    const scaleY = CANVAS_SIZE / uploadedImg.height;
                    imgScale = Math.max(scaleX, scaleY);
                    
                    // Center the image initially
                    imgX = (CANVAS_SIZE - uploadedImg.width * imgScale) / 2;
                    imgY = (CANVAS_SIZE - uploadedImg.height * imgScale) / 2;

                    // Update zoom slider bounds based on image scale
                    zoomSlider.min = imgScale * 0.1;
                    zoomSlider.max = imgScale * 3;
                    zoomSlider.value = imgScale;

                    container.classList.add('has-image');
                    draw();
                };
                uploadedImg.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // STEP 1: Select Role
    roleSelect.addEventListener("change", (e) => {
        const role = e.target.value;
        if (role) {
            // Load the correct transparent frame corresponding to the selection
            frameImg.src = `images/dp frames/${role}.png`;
            frameImg.onload = () => {
                draw();
            };
            // Fallback for errors
            frameImg.onerror = () => {
                console.error("Frame not found:", frameImg.src);
                // We still draw to clear loading states if needed
                draw();
            };
        }
    });

    // STEP 2: Zoom Adjustments
    zoomSlider.addEventListener("input", (e) => {
        if (!uploadedImg) return;
        
        const oldScale = imgScale;
        imgScale = parseFloat(e.target.value);
        
        // Adjust x and y so the image zooms around the center of the canvas
        const centerX = CANVAS_SIZE / 2;
        const centerY = CANVAS_SIZE / 2;
        
        imgX = centerX - (centerX - imgX) * (imgScale / oldScale);
        imgY = centerY - (centerY - imgY) * (imgScale / oldScale);
        
        draw();
    });

    // STEP 2: Pan Adjustments (Click and Drag)
    const startDrag = (clientX, clientY) => {
        if (!uploadedImg) return;
        isDragging = true;
        startX = clientX;
        startY = clientY;
    };

    const doDrag = (clientX, clientY) => {
        if (!isDragging || !uploadedImg) return;

        // Calculate actual scale factor between DOM canvas size and internal 1080x1080 size
        const rect = canvas.getBoundingClientRect();
        const scaleFactor = CANVAS_SIZE / rect.width;

        const deltaX = (clientX - startX) * scaleFactor;
        const deltaY = (clientY - startY) * scaleFactor;

        imgX += deltaX;
        imgY += deltaY;

        startX = clientX;
        startY = clientY;

        draw();
    };

    const endDrag = () => {
        isDragging = false;
    };

    // Desktop Mouse Events (Drag)
    canvas.addEventListener("mousedown", (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => doDrag(e.clientX, e.clientY));
    window.addEventListener("mouseup", endDrag);

    // Desktop Mouse Wheel Event (Zoom)
    canvas.addEventListener("wheel", (e) => {
        if (!uploadedImg) return;
        e.preventDefault(); // Prevent page scroll

        const zoomIntensity = 0.05;
        const oldScale = imgScale;
        
        // Zoom in or out based on scroll direction
        if (e.deltaY < 0) {
            imgScale += zoomIntensity;
        } else {
            imgScale -= zoomIntensity;
        }
        
        // Clamp scale to a sensible range
        imgScale = Math.max(0.1, Math.min(imgScale, 5));
        zoomSlider.value = imgScale;
        
        // Calculate mouse position relative to internal canvas 1080x1080 size
        const rect = canvas.getBoundingClientRect();
        const scaleFactor = CANVAS_SIZE / rect.width;
        
        const mouseX = (e.clientX - rect.left) * scaleFactor;
        const mouseY = (e.clientY - rect.top) * scaleFactor;
        
        // Adjust imgX and imgY so the image zooms around the mouse cursor
        imgX = mouseX - (mouseX - imgX) * (imgScale / oldScale);
        imgY = mouseY - (mouseY - imgY) * (imgScale / oldScale);
        
        draw();
    }, { passive: false });

    // Mobile Touch Events (Drag & Pinch-to-Zoom)
    let initialPinchDistance = null;
    let initialPinchScale = 1;
    let initialPinchCenter = { x: 0, y: 0 };

    canvas.addEventListener("touchstart", (e) => {
        if (!uploadedImg) return;
        
        if (e.touches.length === 2) {
            // Two fingers detected: start pinch-to-zoom
            e.preventDefault();
            isDragging = false; // Stop dragging if we start pinching
            
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            
            initialPinchDistance = Math.hypot(
                t2.clientX - t1.clientX,
                t2.clientY - t1.clientY
            );
            initialPinchScale = imgScale;
            
            const rect = canvas.getBoundingClientRect();
            const scaleFactor = CANVAS_SIZE / rect.width;
            
            // Calculate center point between the two fingers relative to internal canvas
            const centerX = ((t1.clientX + t2.clientX) / 2 - rect.left) * scaleFactor;
            const centerY = ((t1.clientY + t2.clientY) / 2 - rect.top) * scaleFactor;
            
            initialPinchCenter = { x: centerX, y: centerY };
            
        } else if (e.touches.length === 1) {
            // Single finger detected: start drag
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
            e.preventDefault(); // Prevent scrolling while panning
        }
    }, { passive: false });
    
    window.addEventListener("touchmove", (e) => {
        if (!uploadedImg) return;
        
        if (e.touches.length === 2 && initialPinchDistance) {
            e.preventDefault();
            
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            
            const currentDistance = Math.hypot(
                t2.clientX - t1.clientX,
                t2.clientY - t1.clientY
            );
            
            const oldScale = imgScale;
            const newScale = initialPinchScale * (currentDistance / initialPinchDistance);
            
            imgScale = Math.max(0.1, Math.min(newScale, 5));
            zoomSlider.value = imgScale;
            
            // Adjust imgX and imgY so the image zooms around the center of the pinch
            imgX = initialPinchCenter.x - (initialPinchCenter.x - imgX) * (imgScale / oldScale);
            imgY = initialPinchCenter.y - (initialPinchCenter.y - imgY) * (imgScale / oldScale);
            
            draw();
            
        } else if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            doDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });
    
    window.addEventListener("touchend", (e) => {
        if (e.touches.length < 2) {
            initialPinchDistance = null;
        }
        
        if (e.touches.length === 0) {
            endDrag();
        } else if (e.touches.length === 1) {
            // One finger remaining: seamlessly switch to drag mode
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    // Drawing Logic
    function draw() {
        // Clear canvas fully
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw background fallback color (in case images are transparent/not loaded)
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // 1. Draw User Photo (Layer 1)
        if (uploadedImg) {
            // Apply smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            ctx.drawImage(
                uploadedImg,
                imgX,
                imgY,
                uploadedImg.width * imgScale,
                uploadedImg.height * imgScale
            );
        } else {
            // Placeholder text if no image
            ctx.fillStyle = "#666666";
            ctx.font = "bold 36px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Upload your photo to start", CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        }

        // 2. Draw Selected Frame (Layer 2 - Strictly on top)
        if (frameImg.src && frameImg.complete) {
            ctx.drawImage(frameImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        }
    }

    // Export Helper
    const getFileName = () => {
        const role = roleSelect.value || "Custom";
        const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
        return `CCSICT_DP_2026_2027_${capitalizedRole}.png`;
    };

    // STEP 3: Download DP
    downloadBtn.addEventListener("click", () => {
        if (!uploadedImg || !roleSelect.value) {
            alert("Please upload your photo and select a role first.");
            return;
        }
        
        const link = document.createElement("a");
        link.download = getFileName();
        // Export high-quality PNG
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
    });

    // STEP 3: Share to Social Media
    shareBtn.addEventListener("click", async () => {
        if (!uploadedImg || !roleSelect.value) {
            alert("Please upload your photo and select a role first.");
            return;
        }

        const fileName = getFileName();
        
        // Convert canvas to Blob then File for native sharing
        canvas.toBlob(async (blob) => {
            if (!blob) {
                alert("Failed to process image for sharing.");
                return;
            }

            const file = new File([blob], fileName, { type: "image/png" });
            
            // Check Web Share API capability
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: "CCSICT DP Blast",
                        text: "Here is my DP for the CCSICT event! 🚀",
                        files: [file]
                    });
                } catch (err) {
                    // AbortError is thrown when user cancels the share dialog, which is normal
                    if (err.name !== "AbortError") {
                        console.error("Error sharing:", err);
                        alert("An error occurred while sharing. Please use the Download button instead.");
                    }
                }
            } else {
                // Fallback for unsupported browsers/devices
                alert("Sharing files is not supported on your current browser. Please use the Download button to save the image to your device.");
            }
        }, "image/png", 1.0);
    });
});
