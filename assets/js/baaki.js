class Baaki{

    constructor(duration, start = 1, end = 0.60) {
        this.duration = duration;
        this.start = start;
        this.end = end;
        this.animationElements = document.querySelectorAll("[baaki]");
    }

    // Apply full animation
    ApplyAnimation(el) {
        const animationType = el.getAttribute("baaki");  

        el.style.transition = `opacity ${this.duration}s ease-out, transform ${this.duration}s ease-out`;  // Apply duration transition for fast scrolling

        // Calculate a delay for each element (optional: customize)
        const delay = el.getAttribute("baaki-delay") + "ms";  // Use 'data-delay' or fallback to index-based delay
        // Apply the delay to the transition
        el.style.transitionDelay = delay;
        
        // Adjust based on the animation type
        if (animationType === "fade-up") {
            el.style.opacity = 1;  
            el.style.transform = `translateY(0px)`;  
        } else if (animationType === "fade-left") {
            el.style.opacity = 1;  
            el.style.transform = `translateX(0px)`;  
        } else if (animationType === "fade-right") {
            el.style.opacity = 1;  
            el.style.transform = `translateY(0px)`; 
        } else if (animationType === "fade-down") {
            el.style.opacity = 1;  
            el.style.transform = `translateY(0px)`; 
        }
    }

    // Check if elements should animate based on the initial scroll position
    CheckInitialAnimation() {
        const scrollY = window.scrollY;  // Current vertical scroll position
        this.animationElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top + scrollY;  // Element's top position in the document
            const windowHeight = window.innerHeight;  // Height of the viewport
            const startScroll = elementTop - windowHeight * this.start;  // Start when element is 100% from top
            const endScroll = elementTop - windowHeight * this.end;  // End when element is 60% from top
            
            // See if animation is to be played only once 
            const animation_on_load = el.getAttribute("baaki-animation-on-load") == "true" ? true : false;

            // Check if the element is past 10% of its animation range
            if (scrollY > (startScroll + (endScroll - startScroll) * 0.05) || animation_on_load) {
                this.ApplyAnimation(el);  // Trigger the animation if more than 10% past
            }
        });
    }

    // Function to control Baaki animation based on scroll
    ScrollAnimation() {
        let lastScrollY = window.scrollY;  // Store the last scroll position
        let lastTime = Date.now();  // Store the time of the last scroll event

        window.addEventListener("scroll", () => {
            // Vars
            let scrollDelay = 0;
            // Controll scroll
            const scrollY = window.scrollY;  // Current vertical scroll position
            const currentTime = Date.now();  // Current time
            const timeDiff = currentTime - lastTime;  // Time difference since the last scroll event
            const scrollDiff = Math.abs(scrollY - lastScrollY);  // Difference in scroll position

            const scrollSpeed = scrollDiff / timeDiff;  // Calculate scroll speed (distance/time)
            const fastScrollThreshold = this.duration;  // Define the scroll speed threshold for fast scrolling

            // Update last scroll position and time
            lastScrollY = scrollY;
            lastTime = currentTime;
            
            this.animationElements.forEach(el => {

                // Blocks locations
                const elementTop = el.getBoundingClientRect().top + scrollY;  // Element's top position in the document
                const windowHeight = window.innerHeight;  // Height of the viewport
                let startScroll;  // Start when element is 80% from top
                let endScroll;    // End when element is 40% from top (adjust for early end)
                
                // See if animation is to be played only once 
                const scroll_based = el.getAttribute("baaki-scroll-based") == "false" ? false : true;

                // Apply scroll-based progress to custom baaki animations
                const animationType = el.getAttribute("baaki");  // Get the Baaki animation type
                // Animations not bounded by its scroll bounds
                let notBounded = ['follow', 'follow-reverse'];
                // Progress of animation/scroll
                let scrollProgress;

                if(notBounded.includes(animationType)){
                    startScroll = elementTop - windowHeight * 1;
                    endScroll = elementTop - windowHeight * 0;
                    scrollProgress = Math.min(Math.max((scrollY - startScroll) / (endScroll - startScroll), 0), 1);
                }
                else{
                    // Calculate the scroll progress between startScroll and endScroll
                    startScroll = elementTop - windowHeight * this.start;
                    endScroll = elementTop - windowHeight * this.end;

                    // Determine transition based on scroll speed
                    if (scrollSpeed >= fastScrollThreshold) {
                        el.style.transition = `opacity ${this.duration}s ease-out, transform ${this.duration}s ease-out`;  // Apply duration transition for fast scrolling
                    } else {
                        el.style.transition = "opacity 0.2s ease-out, transform 0.2s ease-out";  // No transition for normal scrolling
                        // Add delay
                        scrollDelay = isNaN(parseInt(el.getAttribute("baaki-delay"))) ? 0 : parseInt(el.getAttribute("baaki-delay"))/5;
                        startScroll = startScroll + scrollDelay;
                        endScroll = endScroll + scrollDelay;
                    }
                    
                    // Calculate scroll progress
                    scrollProgress = Math.min(Math.max((scrollY - startScroll) / (endScroll - startScroll), 0), 1);
                }

            
                
                // Calculate a delay for each element (optional: customize)
                let delay = (scrollSpeed >= fastScrollThreshold ? el.getAttribute("baaki-delay") : 0) + "ms";  // Use 'data-delay' or fallback to index-based delay

                // See if opacity needs to be animated
                const opacity_animation = el.getAttribute("baaki-opacity-animation") == "false" ? false : true;

                // Apply the delay to the transition
                el.style.transitionDelay = delay;

                // If animation is not scroll based
                if(!scroll_based){
                    this.ApplyAnimation(el);
                }
                else{
                    // Adjust based on the animation type (you can expand this logic for different animations)
                    if (animationType === "fade-up") {
                        el.style.opacity = !opacity_animation ? 1 : scrollProgress;  // Fade based on scroll progress
                        el.style.transform = `translateY(${(1 - scrollProgress) * 70}px)`;  // Slide up based on scroll
                    } else if (animationType === "fade-left") {
                        el.style.opacity = !opacity_animation ? 1 : scrollProgress;
                        el.style.transform = `translateX(${(1 - scrollProgress) * 70}px)`;  // Slide left based on scroll
                    } else if (animationType === "fade-right") {
                        el.style.opacity = !opacity_animation ? 1 : scrollProgress;
                        el.style.transform = `translateX(-${(1 - scrollProgress) * 70}px)`;  // Slide RIGHT based on scroll
                    } else if (animationType === "fade-down") {
                        el.style.opacity = !opacity_animation ? 1 : scrollProgress;  
                        el.style.transform = `translateY(-${(1 - scrollProgress) * 70}px)`; 
                    } else if (animationType === "follow"){
                        //  Get X component of trasform
                        let computedStyle = window.getComputedStyle(el);
                        var translateX = 0;
                        // If transform exists and is in matrix form, extract translateX (X-component)
                        if(!el.style.transform || el.style.transform === ""){
                            var transform = computedStyle.transform;
                            if (transform && transform !== 'none' && transform.includes('matrix')) {
                                let values = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
                                translateX = values[4]+"px"; // 5th value in matrix is translateX (index 4)
                            }
                        }
                        // Else take trasform from js extracted var
                        else{
                            var transform = el.style.transform;
                            let match = transform.match(/translate(X|)\(([^,]+)[, ]?([^)]*)\)/);
                            if (match) {
                                translateX = match[2]; // Get the X value from translate or translateX
                            }
                        }
                        // Change Y component of transform
                        el.style.transform = `translate(${translateX}, ${-40 - ((1 - scrollProgress) * 50)}%)`; 
                    } else if (animationType === "follow-reverse"){
                        //  Get X component of trasform
                        let computedStyle = window.getComputedStyle(el);
                        var translateX = 0;
                        // If transform exists and is in matrix form, extract translateX (X-component)
                        if(!el.style.transform || el.style.transform === ""){
                            var transform = computedStyle.transform;
                            if (transform && transform !== 'none' && transform.includes('matrix')) {
                                let values = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
                                translateX = values[4]+"px"; // 5th value in matrix is translateX (index 4)
                            }
                        }
                        // Else take trasform from js extracted var
                        else{
                            var transform = el.style.transform;
                            let match = transform.match(/translate(X|)\(([^,]+)[, ]?([^)]*)\)/);
                            if (match) {
                                translateX = match[2]; // Get the X value from translate or translateX
                            }
                        }
                        // Change Y component of transform
                        el.style.transform = `translate(${translateX}, ${-40 + ((1 - scrollProgress) * 50)}%)`; 
                    }
                }
            });
        });
    }

    // Initialize animation
    init(){
        this.CheckInitialAnimation();
        this.ScrollAnimation();
    }
}