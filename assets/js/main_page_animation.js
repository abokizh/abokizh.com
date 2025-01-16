// splitting
Splitting({
    whitespace: true
});
const circle = document.querySelector('.big-circle-spinning');
const text = circle.innerHTML;    
circle.style.setProperty('--numchs', text.length);