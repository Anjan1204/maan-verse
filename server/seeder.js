const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const colors = require('colors');
const User = require('./models/User');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
            },
            {
                name: 'Faculty One',
                email: 'faculty1@example.com',
                password: 'password123',
                role: 'faculty',
            },
            {
                name: 'Faculty Two',
                email: 'faculty2@example.com',
                password: 'password123',
                role: 'faculty',
            },
            {
                name: 'Student User',
                email: 'student@example.com',
                password: 'password123',
                role: 'student',
            },
        ];

        // Create Users manually to trigger pre-save hook for password hashing
        const createdUsers = [];
        for (const u of users) {
            const user = new User(u);
            await user.save();
            createdUsers.push(user);
        }

        const faculty1 = createdUsers[1]._id;
        const faculty2 = createdUsers[2]._id;

        const courses = [
            // --- Development (6) ---
            {
                title: 'Full-Stack Web Development BootCamp 2026',
                description: 'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a job-ready developer.',
                category: 'Development',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
                price: 2499,
                level: 'Beginner',
                duration: '24 Weeks',
                learningOutcomes: [
                    'Build high-performance web applications using React',
                    'Master backend development with Node.js and Express',
                    'Design and implement secure database schemas with MongoDB',
                    'Deploy full-stack applications to professional cloud hosting'
                ],
                requirements: [
                    'A computer with at least 8GB RAM',
                    'Basic understanding of how the web works',
                    'Willingness to learn and practice daily'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Modern Frontend Architecture',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                        isFree: true,
                        quiz: [{ question: 'What is the purpose of React Hooks?', options: ['State management', 'HTML structure', 'Database connection', 'CSS styling'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 450
            },
            {
                title: 'Python for Data Science & AI',
                description: 'Unlock the power of Python for data analysis, visualization, and machine learning.',
                category: 'Development',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1527477396000-dc2173b95701?auto=format&fit=crop&w=800&q=80',
                price: 1899,
                level: 'Intermediate',
                duration: '12 Weeks',
                learningOutcomes: [
                    'Analyze large datasets using Pandas and NumPy',
                    'Create stunning data visualizations with Matplotlib and Seaborn',
                    'Implement key Machine Learning algorithms from scratch',
                    'Understand the fundamentals of Artificial Intelligence'
                ],
                requirements: [
                    'Basic knowledge of Python programming',
                    'Understanding of high-school mathematics',
                    'Python installed on your machine'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Introduction to NumPy',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                        isFree: true,
                        quiz: [{ question: 'What does NumPy provide?', options: ['Arrays', 'Strings', 'HTML', 'CSS'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1200
            },
            {
                title: 'iOS App Development with Swift',
                description: 'Build beautiful, high-performance iPhone and iPad apps from scratch.',
                category: 'Development',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
                price: 2999,
                level: 'All Levels',
                duration: '16 Weeks',
                learningOutcomes: [
                    'Publish your own apps to the Apple App Store',
                    'Master SwiftUI and UIKit for modern interfaces',
                    'Understand iOS app lifecycle and local data storage',
                    'Integrate third-party APIs and network requests'
                ],
                requirements: [
                    'A Mac computer running macOS',
                    'Xcode installed (free on App Store)',
                    'No prior iOS experience required'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'SwiftUI Syntax Guide',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                        isFree: true,
                        quiz: [{ question: 'What is SwiftUI?', options: ['A UI framework', 'A database', 'A compiler', 'A text editor'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 350
            },
            {
                title: 'Blockchain & Ethereum Developer',
                description: 'Learn Solidity and build decentralized applications on the blockchain.',
                category: 'Development',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
                price: 4500,
                level: 'Advanced',
                duration: '10 Weeks',
                learningOutcomes: [
                    'Write and deploy complex Smart Contracts with Solidity',
                    'Understand Ethereum Architecture and Gas optimization',
                    'Build Frontend for DApps using Ethers.js',
                    'Launch your own Token (ERC-20 & ERC-721)'
                ],
                requirements: [
                    'Strong understanding of JavaScript',
                    'Basic knowledge of Web Development',
                    'MetaMask browser extension installed'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Smart Contract Fundamentals',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                        isFree: true,
                        quiz: [{ question: 'What is Solidity used for?', options: ['Smart contracts', 'Web design', 'Game logic', 'Networking'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 180
            },
            {
                title: 'Game Development with Unity',
                description: 'Create 2D and 3D games using C# and the Unity engine.',
                category: 'Development',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                price: 1599,
                level: 'Beginner',
                duration: '14 Weeks',
                learningOutcomes: [
                    'Create fully functional 2D and 3D games',
                    'Master C# programming for game logic',
                    'Understand Unity Physics and Animation systems',
                    'Build and export games for Web, PC, and Mobile'
                ],
                requirements: [
                    'Unity Hub and Editor installed',
                    'Basic computer literacy',
                    'Creativity and problem-solving skills'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Physics and Movement',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                        isFree: true,
                        quiz: [{ question: 'What script language does Unity use?', options: ['C#', 'Java', 'Python', 'C++'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 500
            },
            {
                title: 'Cybersecurity Analyst Certificate',
                description: 'Learn ethical hacking, network security, and defensive strategies.',
                category: 'Development',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
                price: 3299,
                level: 'Intermediate',
                duration: '18 Weeks',
                learningOutcomes: [
                    'Identify and mitigate common security vulnerabilities',
                    'Perform network audits and penetration testing',
                    'Master Linux for security professionals',
                    'Understand Cryptography and Secure Communication'
                ],
                requirements: [
                    'Basic understanding of IT networking',
                    'Familiarity with Virtual Machines (VirtualBox)',
                    'Interest in ethical hacking'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Network Penetration Testing',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is Nmap used for?', options: ['Network scanning', 'Video editing', 'Word processing', 'Graphic design'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 750
            },

            // --- Business (6) ---
            {
                title: 'MBA in a Box: Business Management 2026',
                description: 'Comprehensive business education for entrepreneurs and corporate leaders.',
                category: 'Business',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                price: 1499,
                level: 'Intermediate',
                duration: '20 Weeks',
                learningOutcomes: [
                    'Master strategic planning and business development',
                    'Understand financial statements and corporate finance',
                    'Implement effective operations and supply chain management',
                    'Develop high-performance leadership and team management skills'
                ],
                requirements: [
                    'Basic understanding of business concepts',
                    'Desire to start or grow a business',
                    'Access to standard office software (Excel, PPT)'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Operational Excellence',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is Six Sigma?', options: ['Quality management', 'A rock band', 'A new planet', 'A coffee brand'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 900
            },
            {
                title: 'Project Management Professional (PMP)',
                description: 'Ace the PMP exam and master the art of leading project teams.',
                category: 'Business',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
                price: 3500,
                level: 'Advanced',
                duration: '12 Weeks',
                learningOutcomes: [
                    'Pass the PMP Certification exam on your first attempt',
                    'Apply PMBOK Guide concepts to real-world projects',
                    'Master Agile, Waterfall, and Hybrid methodologies',
                    'Effectively manage project scope, schedule, and budget'
                ],
                requirements: [
                    'General project management experience',
                    'Commitment to rigorous study and practice exams',
                    'Knowledge of basic project cycles'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Scrum & Agile Frameworks',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a Sprint in Agile?', options: ['A work period', 'A race', 'A type of tool', 'A meeting style'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1100
            },
            {
                title: 'Financial Analysis Masterclass',
                description: 'Master Excel, financial modeling, and investment banking concepts.',
                category: 'Business',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80',
                price: 2799,
                level: 'Intermediate',
                duration: '14 Weeks',
                learningOutcomes: [
                    'Build complex 3-statement financial models in Excel',
                    'Perform company valuations using DCF and Comps',
                    'Interpret financial data to drive business decisions',
                    'Understand investment banking and equity research workflows'
                ],
                requirements: [
                    'Intermediate proficiency in Microsoft Excel',
                    'Basic understanding of accounting principles',
                    'Attention to detail and analytical mindset'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Valuation Techniques',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is DCF?', options: ['Discounted Cash Flow', 'Direct Core Finance', 'Daily Capital Fund', 'Data Center Fixed'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 400
            },
            {
                title: 'Product Management 101',
                description: 'Learn the lifecycle of software products from idea to launch.',
                category: 'Business',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                price: 999,
                level: 'Beginner',
                duration: '8 Weeks',
                learningOutcomes: [
                    'Create and manage a product roadmap',
                    'Conduct effective user research and feedback loops',
                    'Write clear PRDs (Product Requirement Documents)',
                    'Work seamlessly with Engineering and Design teams'
                ],
                requirements: [
                    'Interest in technology and user experience',
                    'Strong communication and organizational skills',
                    'No prior technical background required'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'User Story Mapping',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a User Story?', options: ['A requirement', 'A bedtime story', 'A movie script', 'A user manual'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 650
            },
            {
                title: 'Sales & Negotiation Excellence',
                description: 'Close more deals and build lasting customer relationships.',
                category: 'Business',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1427751364703-fe5833483b6d?auto=format&fit=crop&w=800&q=80',
                price: 749,
                level: 'All Levels',
                duration: '6 Weeks',
                learningOutcomes: [
                    'Master the psychology of high-stakes negotiation',
                    'Develop a repeatable sales process for any product',
                    'Handle difficult objections with confidence',
                    'Build rapport and trust with diverse clients'
                ],
                requirements: [
                    'A positive attitude and persistence',
                    'Willingness to practice role-playing scenarios',
                    'Basic social skills'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'The Art of Persuasion',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        isFree: true,
                        quiz: [{ question: 'How do you handle objections?', options: ['Active listening', 'Ignoring them', 'Arguing', 'Giving up'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 220
            },
            {
                title: 'Starting Your Online Business',
                description: 'From dropshipping to SaaS: how to launch and scale a digital venture.',
                category: 'Business',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
                price: 599,
                level: 'Beginner',
                duration: '10 Weeks',
                learningOutcomes: [
                    'Validate your business idea with minimal cost',
                    'Set up your online presence (Shopify, Webflow, etc.)',
                    'Master digital marketing to acquire first customers',
                    'Automate business processes for scalability'
                ],
                requirements: [
                    'A burning desire to be an entrepreneur',
                    'An internet connection and a laptop',
                    'A small budget for testing and tools'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Market Research 101',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        isFree: true,
                        quiz: [{ question: 'Why is research important?', options: ['To understand needs', 'To waste time', 'To spend money', 'To copy others'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1500
            },

            // --- Design (6) ---
            {
                title: 'Graphic Design Masterclass',
                description: 'Learn Photoshop, Illustrator, and InDesign for professional branding.',
                category: 'Design',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
                price: 1249,
                level: 'Beginner',
                duration: '12 Weeks',
                learningOutcomes: [
                    'Master industry-standard design tools (PS, AI, ID)',
                    'Understand typography, color theory, and layout principles',
                    'Create professional branding and marketing materials',
                    'Build a creative portfolio that attracts high-paying clients'
                ],
                requirements: [
                    'Adobe Creative Cloud subscription',
                    'A creative mind and passion for visual arts',
                    'Basic computer skills'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Vector Illustration',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is vector art?', options: ['Scalable graphics', 'Pixelated images', 'Sound files', 'Video clips'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 3000
            },
            {
                title: 'UX Research & UI Design',
                description: 'Design digital experiences that users love. From wireframes to prototypes.',
                category: 'Design',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80',
                price: 1699,
                level: 'Intermediate',
                duration: '14 Weeks',
                learningOutcomes: [
                    'Conduct thorough user research and usability testing',
                    'Create high-fidelity prototypes using Figma',
                    'Understand User-Centered Design (UCD) processes',
                    'Design responsive and accessible digital products'
                ],
                requirements: [
                    'Figma (free to use)',
                    'Empathy for user needs and pain points',
                    'Logical thinking and problem-solving'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Empathy Mapping',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is an Empathy Map?', options: ['A user research tool', 'A GPS map', 'A design software', 'An emotion chart'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 880
            },
            {
                title: 'Motion Graphics with After Effects',
                description: 'Bring your designs to life with animation and visual effects.',
                category: 'Design',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80',
                price: 2100,
                level: 'Intermediate',
                duration: '10 Weeks',
                learningOutcomes: [
                    'Master keyframe animation and easing techniques',
                    'Create complex visual effects and title card animations',
                    'Understand kinetic typography and character rigging',
                    'Render and export professional-grade video content'
                ],
                requirements: [
                    'Adobe After Effects installed',
                    'Basic understanding of graphic design',
                    'A computer with a good graphics card'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Keyframe Principles',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a Keyframe?', options: ['A point in time', 'A type of window', 'A design tool', 'A color palette'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 560
            },
            {
                title: '3D Modeling & Rendering in Blender',
                description: 'Master the art of 3D creation from modeling to photorealistic rendering.',
                category: 'Design',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=800&q=80',
                price: 1450,
                level: 'Beginner',
                duration: '16 Weeks',
                learningOutcomes: [
                    'Create complex 3D models from scratch',
                    'Master texturing, lighting, and UV unwrapping',
                    'Animate 3D characters and environments',
                    'Produce high-quality photorealistic renders'
                ],
                requirements: [
                    'Blender (free and open source)',
                    'A 3-button mouse',
                    'Persistence and spatial awareness'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Mesh Editing Basics',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a Vertex?', options: ['A point in 3D space', 'A color', 'A light source', 'A texture'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1250
            },
            {
                title: 'Interior Design Fundamentals',
                description: 'Design beautiful, functional spaces for residential and commercial use.',
                category: 'Design',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
                price: 1999,
                level: 'All Levels',
                duration: '12 Weeks',
                learningOutcomes: [
                    'Understand space planning and furniture arrangement',
                    'Master color palettes and material selection',
                    'Create mood boards and design presentations',
                    'Understand lighting design and architectural basics'
                ],
                requirements: [
                    'Passion for interiors and decor',
                    'Basic drawing or sketching tools',
                    'A laptop or tablet for digital layouts'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Color Psychology in Design',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        isFree: true,
                        quiz: [{ question: 'How do warm colors affect a room?', options: ['Make it cozy', 'Make it cold', 'Make it dark', 'Make it empty'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 340
            },
            {
                title: 'Logo Design & Branding Strategy',
                description: 'Create iconic logos and cohesive brand identities for modern businesses.',
                category: 'Design',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80',
                price: 899,
                level: 'Beginner',
                duration: '8 Weeks',
                learningOutcomes: [
                    'Create timeless and scalable logo designs',
                    'Develop comprehensive brand style guides',
                    'Understand the psychology behind brand identity',
                    'Pitch and present branding projects to clients'
                ],
                requirements: [
                    'Sketching materials (paper & pencil)',
                    'Adobe Illustrator or similar vector software',
                    'Interest in marketing and conceptual art'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Symbolism and Shapes',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        isFree: true,
                        quiz: [{ question: 'What makes a logo memorable?', options: ['Simplicity', 'Complexity', 'Many colors', 'Small text'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 2200
            },

            // --- Marketing (6) ---
            {
                title: 'Social Media Marketing Ads',
                description: 'Run conversion-focused ads on Facebook, Instagram, and TikTok.',
                category: 'Marketing',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
                price: 949,
                level: 'Beginner',
                duration: '8 Weeks',
                learningOutcomes: [
                    'Create and manage high-converting ad campaigns',
                    'Master organic growth strategies for major platforms',
                    'Analyze social media metrics and ROI',
                    'Develop a comprehensive content calendar and strategy'
                ],
                requirements: [
                    'Personal social media accounts',
                    'A small budget for testing ads (optional)',
                    'Interest in consumer psychology'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Ad Copywriting Strategies',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a CTA?', options: ['Call To Action', 'Core Tech Access', 'Client Team Area', 'Case Test Audit'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 2200
            },
            {
                title: 'Content Marketing Masterclass',
                description: 'Write engaging blogs, scripts, and emails that drive traffic.',
                category: 'Marketing',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1499750310117-599d870e097d?auto=format&fit=crop&w=800&q=80',
                price: 799,
                level: 'Beginner',
                duration: '6 Weeks',
                learningOutcomes: [
                    'Write SEO-friendly and engaging copy for blogs and emails',
                    'Understand the content marketing funnel and lead generation',
                    'Master storytelling techniques for brand building',
                    'Measure content performance using Google Analytics'
                ],
                requirements: [
                    'Strong command of written language',
                    'Access to a blog site or social media account',
                    'Interest in storytelling and communication'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Storytelling for Brands',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        isFree: true,
                        quiz: [{ question: 'Why use stories?', options: ['To build connection', 'To confuse', 'To sleep', 'To talk more'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1300
            },
            {
                title: 'Effective Email Marketing',
                description: 'Master Mailchimp and Klaviyo to build high-converting email funnels.',
                category: 'Marketing',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
                price: 649,
                level: 'Intermediate',
                duration: '6 Weeks',
                learningOutcomes: [
                    'Build a high-quality email list from scratch',
                    'Design automated drip campaigns that convert',
                    'Understand email segmentation and personalization',
                    'Optimize open rates and click-through rates'
                ],
                requirements: [
                    'Access to an email marketing tool (Mailchimp, etc.)',
                    'Basic marketing knowledge',
                    'No prior email list required'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Segmentation & Automations',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is segmentation?', options: ['Grouping users', 'Cutting text', 'Sending emails', 'Buying lists'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 450
            },
            {
                title: 'YouTube Channel Growth Course',
                description: 'Build your audience and monetize your content on YouTube.',
                category: 'Marketing',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1611162616305-9b7a3293812b?auto=format&fit=crop&w=800&q=80',
                price: 1199,
                level: 'All Levels',
                duration: '10 Weeks',
                learningOutcomes: [
                    'Understand the YouTube recommendation algorithm',
                    'Create thumbnails and titles that get clicked',
                    'Perform keyword research for video SEO',
                    'Monetize your channel through multiple streams'
                ],
                requirements: [
                    'A YouTube channel (existing or new)',
                    'Basic camera or smartphone',
                    'Persistence and consistency'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Thumbnails & SEO',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is CTR?', options: ['Click Through Rate', 'Core Time Ratio', 'Call Track Report', 'Case Test Run'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 3100
            },
            {
                title: 'Affiliate Marketing Secrets',
                description: 'Passive income strategies for promoting digital and physical products.',
                category: 'Marketing',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80',
                price: 549,
                level: 'Beginner',
                duration: '4 Weeks',
                learningOutcomes: [
                    'Find and join profitable affiliate programs',
                    'Promote products ethically on various platforms',
                    'Track and optimize your affiliate earnings',
                    'Understand Amazon Associates and other networks'
                ],
                requirements: [
                    'Access to social media or a blog',
                    'Understanding of online sales',
                    'No starting capital needed'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Finding High-Ticket Offers',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is an affiliate link?', options: ['Unique track link', 'A common URL', 'A phone number', 'An email address'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 2800
            },
            {
                title: 'E-commerce SEO for Shopify',
                description: 'Rank your store higher and get organic sales from Google.',
                category: 'Marketing',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80',
                price: 1399,
                level: 'Intermediate',
                duration: '12 Weeks',
                learningOutcomes: [
                    'Optimize Ecommerce stores for maximum conversions',
                    'Scale ad spend using sophisticated ROI models',
                    'Implement retention marketing and email flows',
                    'Understand supply chain and international scaling'
                ],
                requirements: [
                    'Active Ecommerce store',
                    'Basic understanding of paid ads',
                    'Laptop and internet'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Product Page Optimization',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                        isFree: true,
                        quiz: [{ question: 'Why optimize product titles?', options: ['For better ranking', 'For no reason', 'To look long', 'To hide info'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 110
            },

            // --- Photography & Music (6) ---
            {
                title: 'Professional Photography Masterclass',
                description: 'Master manual settings, lighting, and composition to capture stunning photos.',
                category: 'Photography',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
                price: 849,
                level: 'Beginner',
                duration: '10 Weeks',
                learningOutcomes: [
                    'Master the exposure triangle (ISO, Aperture, Shutter Speed)',
                    'Understand professional lighting for portraits and landscapes',
                    'Learn advanced composition techniques for visual storytelling',
                    'Edit photos professionally in Adobe Lightroom'
                ],
                requirements: [
                    'A DSLR or Mirrorless camera with manual controls',
                    'Basic understanding of image files',
                    'A computer for photo editing'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'The Exposure Triangle',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        isFree: true,
                        quiz: [{ question: 'What are the three pillars of exposure?', options: ['ISO, Aperture, Shutter Speed', 'Focus, Zoom, Flash', 'Lens, Filter, Crop', 'Auto, Manual, Night'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1400
            },
            {
                title: 'Adobe Lightroom & Photoshop for Photographers',
                description: 'Level up your editing workflow and create iconic images.',
                category: 'Photography',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
                price: 775,
                level: 'Intermediate',
                duration: '6 Weeks',
                learningOutcomes: [
                    'Master non-destructive editing in Adobe Lightroom',
                    'Learn advanced retouching and compositing in Photoshop',
                    'Develop a consistent and professional editing style',
                    'Prepare images for print and high-res digital display'
                ],
                requirements: [
                    'Adobe Lightroom and Photoshop subscription',
                    'Basic photography knowledge',
                    'Raw files to practice with'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Color Grading Mastery',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a Histogram?', options: ['Graph of tonal values', 'A timer', 'A zoom tool', 'A type of lens'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 820
            },
            {
                title: 'iPhone Photography Academy',
                description: 'Take jaw-dropping photos with the device in your pocket.',
                category: 'Photography',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                price: 525,
                level: 'All Levels',
                duration: '4 Weeks',
                learningOutcomes: [
                    'Discover hidden pro camera features on your iPhone',
                    'Edit photos like a pro using mobile apps (Snapseed, Lightroom)',
                    'Master natural lighting and mobile composition',
                    'Shoot stunning portraits and landscapes on the go'
                ],
                requirements: [
                    'An iPhone (any model with a camera)',
                    'No prior photography experience',
                    'A passion for capturing moments'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Hidden Camera Features',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        isFree: true,
                        quiz: [{ question: 'Can you shoot RAW on iPhone?', options: ['Yes', 'No', 'Only at night', 'Only on old models'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 4500
            },
            {
                title: 'Music Production with Ableton Live',
                description: 'Compose, record, and finish professional sounding tracks.',
                category: 'Music',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
                price: 1099,
                level: 'Intermediate',
                duration: '12 Weeks',
                learningOutcomes: [
                    'Master the Ableton Live interface and workflow',
                    'Create original beats and melodies using MIDI and Audio',
                    'Master basic mixing and mastering techniques',
                    'Record and process vocals and live instruments'
                ],
                requirements: [
                    'Ableton Live (trial or licensed)',
                    'Basic musical understanding',
                    'A decent pair of headphones or monitors'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Building Your First Beat',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a DAW?', options: ['Digital Audio Workstation', 'Daily Air Wave', 'Direct Audio Wire', 'Data Audit web'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1100
            },
            {
                title: 'Piano for Beginners: Zero to Hero',
                description: 'Learn to play your favorite songs on piano in just a few weeks.',
                category: 'Music',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1520529612224-dbe759f2010a?auto=format&fit=crop&w=800&q=80',
                price: 675,
                level: 'Beginner',
                duration: '8 Weeks',
                learningOutcomes: [
                    'Play basic songs with both hands independently',
                    'Understand music theory: scales, chords, and rhythm',
                    'Read sheet music and play by ear',
                    'Develop proper hand technique and posture'
                ],
                requirements: [
                    'A piano or a keyboard',
                    '15-30 minutes of daily practice',
                    'No prior musical experience needed'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Hand Positioning Basics',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        isFree: true,
                        quiz: [{ question: 'How many keys are on a full piano?', options: ['88', '76', '61', '52'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 3300
            },
            {
                title: 'Vocal Mastery: Find Your Voice',
                description: 'Learn breath control, pitch correction, and professional singing techniques.',
                category: 'Music',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
                price: 625,
                level: 'All Levels',
                duration: '10 Weeks',
                learningOutcomes: [
                    'Master breath support and control for powerful singing',
                    'Expand your vocal range and improve pitch accuracy',
                    'Learn warm-up and cool-down techniques to protect your voice',
                    'Find and develop your unique vocal style'
                ],
                requirements: [
                    'A quiet place to practice singing',
                    'Love for music and singing',
                    'A bottle of water for vocal health'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Warm-up Exercises',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
                        isFree: true,
                        quiz: [{ question: 'Why warm up?', options: ['To prevent injury', 'To sound loud', 'To look cool', 'To waste time'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 770
            },

            // --- Health & Fitness (6) ---
            {
                title: 'Ultimate Home Workout Plan',
                description: 'Get fit without a gym. Full body exercises and nutrition guide.',
                category: 'Health & Fitness',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
                price: 550,
                level: 'Beginner',
                duration: '6 Weeks',
                learningOutcomes: [
                    'Perform effective full-body workouts with zero equipment',
                    'Understand the fundamentals of muscle building and fat loss',
                    'Create a personalized nutrition plan for your goals',
                    'Master proper form for common bodyweight exercises'
                ],
                requirements: [
                    'Small space for exercising at home',
                    'Positive attitude and consistency',
                    'No gym equipment required'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Bodyweight Training',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a burpee?', options: ['Exercise', 'A snack', 'A drink', 'A rest'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1900
            },
            {
                title: 'Yoga Mastery for Flexibility',
                description: 'Journey through sequences designed to improve balance and inner peace.',
                category: 'Health & Fitness',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
                price: 575,
                level: 'Beginner',
                duration: '8 Weeks',
                learningOutcomes: [
                    'Master foundational yoga poses and transitions',
                    'Improve overall flexibility, balance, and core strength',
                    'Learn breathing techniques for stress reduction',
                    'Develop a sustainable daily yoga practice'
                ],
                requirements: [
                    'A yoga mat or soft surface',
                    'Comfortable clothing',
                    'Open mind and patience'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Sun Salutations',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                        isFree: true,
                        quiz: [{ question: 'What does Namaste mean?', options: ['I bow to you', 'Goodbye', 'Exercise', 'Stretch'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 2500
            },
            {
                title: 'Nutrition & Diet Planning',
                description: 'Understand macronutrients, keto, and plant-based healthy living.',
                category: 'Health & Fitness',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
                price: 699,
                level: 'Beginner',
                duration: '4 Weeks',
                learningOutcomes: [
                    'Understand the role of macronutrients and micronutrients',
                    'Learn to calculate and track your daily caloric needs',
                    'Evaluate different dietary approaches (Keto, Plant-based, etc.)',
                    'Create a sustainable and healthy meal plan'
                ],
                requirements: [
                    'Interest in health and nutrition',
                    'Willingness to track food intake',
                    'Access to a kitchen for meal prep'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Tracking Your Macros',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a calorie?', options: ['Energy unit', 'Fat cell', 'Muscle fiber', 'Vitamin'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1200
            },
            {
                title: 'Mindfulness & Stress Management',
                description: 'Techniques for anxiety relief, better sleep, and mental clarity.',
                category: 'Health & Fitness',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
                price: 515,
                level: 'All Levels',
                duration: '6 Weeks',
                learningOutcomes: [
                    'Learn proven meditation and mindfulness techniques',
                    'Understand the psychology and physiology of stress',
                    'Develop effective coping mechanisms for anxiety',
                    'Improve sleep quality and overall mental well-being'
                ],
                requirements: [
                    'A quiet space for meditation',
                    'Journal or notebook',
                    'Openness to mental health practices'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Breathing for Calm',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is mindfulness?', options: ['Being present', 'Thinking about future', 'Sleeping', 'Exercising'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 2100
            },
            {
                title: 'Intermittent Fasting Masterclass',
                description: 'The complete guide to fasting for weight loss and longevity.',
                category: 'Health & Fitness',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1490818387583-1baba5e6382b?auto=format&fit=crop&w=800&q=80',
                price: 535,
                level: 'Intermediate',
                duration: '4 Weeks',
                learningOutcomes: [
                    'Understand different fasting protocols (16:8, OMAD, etc.)',
                    'Learn the science behind autophagy and fat burning',
                    'Manage hunger and energy levels while fasting',
                    'Combine fasting with exercise for optimal results'
                ],
                requirements: [
                    'No major underlying health conditions',
                    'Interest in metabolic health',
                    'A scale and mirror for tracking'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'Fasting Protocols',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is 16:8?', options: ['Fasting method', 'A math equation', 'A song title', 'A time of day'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 1450
            },
            {
                title: 'Building Muscle: Strength Training',
                description: 'Master the compound lifts and build a powerful physique.',
                category: 'Health & Fitness',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
                price: 1299,
                level: 'Intermediate',
                duration: '12 Weeks',
                learningOutcomes: [
                    'Master the Squat, Deadlift, and Bench Press form',
                    'Understand the principles of progressive overload',
                    'Design an effective strength training program',
                    'Optimize recovery and injury prevention'
                ],
                requirements: [
                    'Access to a gym with free weights',
                    'Basic physical condition',
                    'Commitment to heavy lifting'
                ],
                isPublished: true,
                chapters: [
                    {
                        title: 'The Big Three Lifts',
                        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        isFree: true,
                        quiz: [{ question: 'What is a Squat?', options: ['Compound exercise', 'A stretch', 'A rest pose', 'A jump'], correctAnswer: 0 }]
                    }
                ],
                enrolledCount: 880
            },
        ];

        await Course.insertMany(courses);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (require.main === module) {
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
}

module.exports = { importData, destroyData };
