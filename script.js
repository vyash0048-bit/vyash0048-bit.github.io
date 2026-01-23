// ============================================
// DOM CACHE
// ============================================
const domCache = {
    navbar: null,
    sections: null,
    navLinks: null,
    canvas: null,
    ctx: null,
    
    init() {
        this.navbar = document.querySelector('.navbar');
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.canvas = document.getElementById('neural-bg');
        this.ctx = this.canvas?.getContext('2d');
    }
};

// ============================================
// NEURAL NETWORK BACKGROUND
// ============================================
class NeuralNetwork {
    constructor() {
        this.canvas = domCache.canvas;
        if (!this.canvas) return;
        
        this.ctx = domCache.ctx;
        this.nodes = [];
        this.nodeCount = window.innerWidth < 768 ? 30 : window.innerWidth < 1200 ? 50 : 80;
        this.fps = 30;
        this.frameInterval = 1000 / this.fps;
        this.lastFrameTime = 0;
        
        this.resize();
        this.createNodes();
        this.animate(0);
        
        window.addEventListener('resize', () => {
            this.resize();
            this.createNodes();
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNodes() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    animate(currentTime) {
        if (currentTime - this.lastFrameTime < this.frameInterval) {
            requestAnimationFrame((time) => this.animate(time));
            return;
        }
        this.lastFrameTime = currentTime;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            this.ctx.fill();
        });
        
        this.nodes.forEach((node1, i) => {
            this.nodes.slice(i + 1).forEach(node2 => {
                const dx = node1.x - node2.x;
                const dy = node1.y - node2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node1.x, node1.y);
                    this.ctx.lineTo(node2.x, node2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame((time) => this.animate(time));
    }
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
class Typewriter {
    constructor(element, words, typingSpeed = 80, deletingSpeed = 50, delay = 2000) {
        this.element = element;
        this.words = words;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.delay = delay;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        const currentWord = this.words[this.wordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.wordIndex = (this.wordIndex + 1) % this.words.length;
                setTimeout(() => this.type(), 500);
                return;
            }
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
            if (this.charIndex === currentWord.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.delay);
                return;
            }
        }
        
        setTimeout(() => this.type(), this.isDeleting ? this.deletingSpeed : this.typingSpeed);
    }
}

// ============================================
// DATA: YASH'S PROJECTS
// ============================================
const projects = [
    {
        icon: 'fa-wine-glass-alt',
        title: 'Wine Quality MLOps Pipeline',
        description: 'Architected a modular end-to-end MLOps workflow orchestrating a 5-stage pipeline (Ingestion to Evaluation). Deployed a scalable Flask API for real-time inference.',
        tags: ['MLflow', 'DagsHub', 'Flask', 'HTML/CSS'],
        github: 'https://github.com/vyash0048-bit/Wine-quality-Prediction-using-ML-with-MLops'
    },
    {
        icon: 'fa-shield-alt',
        title: 'Cyber Intelligence Dashboard',
        description: 'Engineered a high-performance visualization tool to monitor global data breach trends. Implemented complex callback logic for cross-filtering and state management.',
        tags: ['Dash', 'Plotly', 'Pandas', 'Visualization'],
        github: 'https://github.com/vyash0048-bit/Data-Beach-Dashboard-Using-Ploty-Dash'
    },
    {
        icon: 'fa-cogs',
        title: 'Modular Automated ML System',
        description: 'Built an automated workflow script that runs data gathering, processing, and training sequentially. Implemented smart error tracking with custom logging.',
        tags: ['Python', 'Automation', 'Error Tracking', 'MLOps'],
        github: 'https://github.com/vyash0048-bit/ML-project-with-complete-MLops-pipeline'
    }
];

// ============================================
// RENDER PROJECTS
// ============================================
function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    
    projects.forEach((project, index) => {
        // Create the anchor tag wrapper to make the whole card clickable
        const cardLink = document.createElement('a');
        cardLink.href = project.github;
        cardLink.target = "_blank";
        cardLink.style.textDecoration = "none";
        cardLink.style.color = "inherit";
        cardLink.style.display = "block"; // Important for layout
        
        const card = document.createElement('div');
        card.className = 'card';
        // Add minimal scroll animation style
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 100}ms`;
        
        card.innerHTML = `
            <div class="card-icon">
                <i class="fas ${project.icon}"></i>
            </div>
            <h3 class="card-title">${project.title}</h3>
            <p class="card-description">${project.description}</p>
            <div class="card-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-link" style="margin-top: 15px;">
                <i class="fab fa-github"></i> View Code
            </div>
        `;
        
        cardLink.appendChild(card);
        fragment.appendChild(cardLink);
        
        // Simple Intersection Observer for animation
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });
        observer.observe(card);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    domCache.init();
    
    // 1. Start Background
    new NeuralNetwork();
    
    // 2. Start Typewriter
    const typewriterElement = document.querySelector('.typing-text');
    if (typewriterElement) {
        new Typewriter(
            typewriterElement,
            [
                'Data Scientist',
                'MLOps Engineer',
                'M.Sc. Mathematics Student',
                'Predictive Modeler'
            ]
        );
    }
    
    // 3. Render Projects
    renderProjects();
    
    // 4. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });
});
