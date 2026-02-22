const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });
connectDB();

const importData = async () => {
    try {
        console.log(`Connecting to: ${mongoose.connection.host}`);
        await Course.deleteMany();
        await User.deleteMany();
        console.log('Existing data cleared.');

        const users = [
            { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
            { name: 'Faculty One', email: 'faculty1@example.com', password: 'password123', role: 'faculty' },
            { name: 'Faculty Two', email: 'faculty2@example.com', password: 'password123', role: 'faculty' },
            { name: 'Student User', email: 'student@example.com', password: 'password123', role: 'student' },
        ];

        const createdUsers = [];
        for (const u of users) {
            const user = new User(u);
            await user.save();
            createdUsers.push(user);
        }

        const faculty1 = createdUsers[1]._id;
        const faculty2 = createdUsers[2]._id;

        // --- Course Data Helper ---
        const createChapter = (title, videoUrl) => {
            const questions = [];
            const topics = [
                'Fundamental Principles', 'Strategic Application', 'Theoretical Framework',
                'Operational Efficiency', 'Scalability Patterns', 'Error Handling Protocols',
                'Advanced Architecture', 'Security Best Practices', 'Optimization Logic',
                'Future Implementations'
            ];

            for (let i = 0; i < 10; i++) {
                questions.push({
                    question: `Regarding ${title}, what is the critical factor in ${topics[i]}?`,
                    options: [
                        `Enhanced ${topics[i]} through modular design`,
                        `Optimized resource allocation for ${topics[i]}`,
                        `Standardized protocols for ${topics[i]} synchronization`,
                        `Legacy system compatibility with ${topics[i]}`
                    ],
                    correctAnswer: Math.floor(Math.random() * 4)
                });
            }

            return {
                title,
                videoUrl: videoUrl || 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                isFree: true,
                quiz: questions
            };
        };

        const devCourses = [
            {
                title: 'Full-Stack Web Dev 2026',
                description: 'An exhaustive exploration of modern web architecture. This curriculum traverses the entire lifecycle of a digital product, from high-performance React frontend architectures to scalable Node.js microservices. Students will master the intricacies of asynchronous state management, secure RESTful API design, and cloud-native deployment strategies using Docker and Kubernetes.',
                category: 'Development',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
                price: 2499,
                level: 'Beginner',
                duration: '24 Weeks',
                isPublished: true,
                chapters: [createChapter('HTML & CSS Foundations'), createChapter('JavaScript ES6+'), createChapter('React Deep Dive'), createChapter('Node.js & Express API')],
                enrolledCount: 1200
            },
            {
                title: 'Python for Data Science & AI',
                description: 'Unlock the power of artificial intelligence through Python. This intensive course focuses on technical proficiency in data manipulation and the implementation of sophisticated machine learning algorithms. You will leverage libraries like Scikit-Learn and TensorFlow to build predictive models that drive institutional decision-making and automate complex analytical workflows.',
                category: 'Development',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1527477396000-dc2173b95701',
                price: 1899,
                level: 'Intermediate',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('NumPy & Pandas'), createChapter('Matplotlib Visualization'), createChapter('Scikit-Learn ML')],
                enrolledCount: 1500
            },
            {
                title: 'iOS App Dev with SwiftUI',
                description: 'Engineered for developers seeking to build high-fidelity applications for the Apple ecosystem. This course deep-dives into the Declarative UI paradigms of SwiftUI, focusing on efficient state management, hardware acceleration, and seamless integration with Core Data and CloudKit. Students finish by deploying a production-ready application to the App Store.',
                category: 'Development',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
                price: 2999,
                level: 'Advanced',
                duration: '16 Weeks',
                isPublished: true,
                chapters: [createChapter('SwiftUI Basics'), createChapter('State Management'), createChapter('App Store Deployment')],
                enrolledCount: 800
            },
            {
                title: 'Blockchain & Smart Contracts',
                description: 'Master the economics and engineering of decentralized finance. We focus on Solidity smart contract security, Gas optimization techniques, and the architectural patterns of leading Layer-1 and Layer-2 blockchains. By the end of this track, students will be capable of auditing decentralized protocols and deploying complex DApps on the Ethereum Mainnet.',
                category: 'Development',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
                price: 4500,
                level: 'Advanced',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Ethereum Intro'), createChapter('Solidity Syntax'), createChapter('DApp Frontend')],
                enrolledCount: 600
            },
            {
                title: 'Game Dev with Unity & C#',
                description: 'Step into the realm of real-time 3D simulation. This course covers the technical foundations of the Unity Personal and Pro engines, focusing on C# scripting for advanced gameplay mechanics, custom shader development, and cross-platform optimization. Students will build a robust multi-level game featuring AI-driven entities and physics-based interactions.',
                category: 'Development',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
                price: 1599,
                level: 'Beginner',
                duration: '14 Weeks',
                isPublished: true,
                chapters: [createChapter('Unity Interface'), createChapter('C# Scripting'), createChapter('Physics & Colliders')],
                enrolledCount: 950
            },
            {
                title: 'Cybersecurity Analyst Bootcamp',
                description: 'Prepare for the frontlines of digital defense. This bootcamp provides hands-on experience in penetration testing, incident response protocols, and network hardening techniques. You will learn to utilize industry-standard tools for forensic analysis and develop comprehensive security policies that protect institutional assets from sophisticated cyber threats.',
                category: 'Development',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
                price: 3299,
                level: 'Intermediate',
                duration: '18 Weeks',
                isPublished: true,
                chapters: [createChapter('Network Security'), createChapter('Ethical Hacking'), createChapter('Incident Response')],
                enrolledCount: 1100
            },
            {
                title: 'Rust Programming Masterclass',
                description: 'Harness the performance of C++ with the memory safety of Rust. We explore the Ownership model, Lifetimes, and Concurrency paradigms that make Rust the preferred choice for systems engineering and high-traffic backends. This course is designed for professional developers looking to build mission-critical, crash-proof infrastructure.',
                category: 'Development',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
                price: 2100,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Ownership & Borrowing'), createChapter('Cargo & Modules'), createChapter('Concurrency')],
                enrolledCount: 700
            },
            {
                title: 'DevOps & AWS Cloud Arch',
                description: 'Bridge the gap between development and operations. This track focuses on the automation of the software delivery lifecycle using AWS Cloud services, Terraform for Infrastructure as Code, and Kubernetes for container orchestration. Mastery of these tools allows for the deployment of globally distributed, self-healing application architectures.',
                category: 'Development',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
                price: 3500,
                level: 'Advanced',
                duration: '20 Weeks',
                isPublished: true,
                chapters: [createChapter('Docker Containers'), createChapter('K8s Orchestration'), createChapter('AWS Services')],
                enrolledCount: 1300
            },
            {
                title: 'Java Spring Boot Microservices',
                description: 'Build enterprise-grade distributed systems. This curriculum covers the Spring ecosystem in depth, focusing on Spring Boot for microservice initialization, Spring Security for robust authentication, and Spring Cloud for managing service discovery and configuration in a high-concurrency environment.',
                category: 'Development',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
                price: 1999,
                level: 'Intermediate',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Spring Core'), createChapter('REST APIs'), createChapter('Microservices Hub')],
                enrolledCount: 900
            },
            {
                title: 'Go (Golang) Backend Dev',
                description: 'Developed by Google, Go is built for the modern multi-core era. This course focuses on Go’s unique concurrency primitives—goroutines and channels—to build blazingly fast backend services. You will learn to architect high-throughput APIs and system utilities that outperform traditional interpreted languages.',
                category: 'Development',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a',
                price: 1799,
                level: 'Beginner',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Go Syntax'), createChapter('Goroutines'), createChapter('Gin Web Framework')],
                enrolledCount: 850
            }
        ];

        const designCourses = [
            {
                title: 'Graphic Design Masterclass',
                description: 'A professional curriculum for aspiring visual communicators. This course goes beyond software skills, focusing on the cognitive foundations of design, color theory psychology, and the technical precision required for large-scale print and digital publishing. You will master the Adobe Creative Cloud suite to create compelling institutional branding and visual assets.',
                category: 'Design',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d',
                price: 1249,
                level: 'Beginner',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Vector Art Foundations'), createChapter('Typography & Layout'), createChapter('Branding Design')],
                enrolledCount: 3000
            },
            {
                title: 'UX/UI Design Pro',
                description: 'Master the user-centric engineering of digital interfaces. This course covers the end-to-end design lifecycle, from ethnographic user research to advanced Figma prototyping. You will learn to architect intuitive navigation systems, implement responsive design systems, and validate your designs through sophisticated usability testing protocols.',
                category: 'Design',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c',
                price: 1699,
                level: 'Intermediate',
                duration: '14 Weeks',
                isPublished: true,
                chapters: [createChapter('User Research'), createChapter('Wireframing in Figma'), createChapter('High-Fidelity Prototyping')],
                enrolledCount: 2200
            },
            {
                title: '3D Modeling with Blender',
                description: 'Engineered for designers seeking a foothold in the 3D industry. We explore the high-fidelity rendering capabilities of Blender, focusing on mesh topology optimization, procedural shader generation, and photorealistic lighting techniques. Students will build a portfolio of cinematic-quality 3D assets suitable for game engines and high-end visual effects.',
                category: 'Design',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519',
                price: 1450,
                level: 'Beginner',
                duration: '16 Weeks',
                isPublished: true,
                chapters: [createChapter('Low Poly Modeling'), createChapter('Texturing & Shaders'), createChapter('Lighting & Rendering')],
                enrolledCount: 1800
            },
            {
                title: 'Motion Graphics with After Effects',
                description: 'Bridge the gap between static design and cinematic animation. This course focuses on the technical intricacies of motion—interpolation curves, physical simulations, and rhythmic synchronization. You will learn to use Adobe After Effects to create high-impact broadcast graphics, UX micro-interactions, and professional title sequences.',
                category: 'Design',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
                price: 2100,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Keyframe Animation'), createChapter('Visual Effects'), createChapter('Kinetic Typography')],
                enrolledCount: 1560
            },
            {
                title: 'Logo Design & Brand Identity',
                description: 'Learn the strategic engineering of brand symbology. This course explores the geometry of iconic logos and the systemic thinking required to build a cohesive brand identity. You will learn to translate institutional values into visual systems that maintain integrity across all touchpoints, from digital footprints to physical environmental graphics.',
                category: 'Design',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f',
                price: 899,
                level: 'Beginner',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Sketching & Ideation'), createChapter('Vector Implementation'), createChapter('Style Guides')],
                enrolledCount: 2500
            },
            {
                title: 'Web Design & Webflow',
                description: 'Design and deploy premium web experiences without writing complex code. This course focuses on the "Box Model" logic and advanced CSS systems utilized within Webflow. You will master the design of responsive layouts and complex CMS architectures, finishing with an industry-grade portfolio site that features custom interactions and animations.',
                category: 'Design',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166',
                price: 1350,
                level: 'Intermediate',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Visual Hierarchy'), createChapter('Responsive Design'), createChapter('CMS & Interactions')],
                enrolledCount: 1400
            },
            {
                title: 'Interior Design Basics',
                description: 'Master the technical and aesthetic planning of residential environments. This curriculum covers spatial ergonomics, sustainable material selection, and lighting architecture. You will learn to create detailed 2D floor plans and high-fidelity 3D walkthroughs that prioritize both functional utility and premium visual comfort.',
                category: 'Design',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
                price: 1999,
                level: 'All Levels',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Color Theory'), createChapter('Space Planning'), createChapter('Material Selection')],
                enrolledCount: 900
            },
            {
                title: 'Fashion Design & Illustration',
                description: 'From biological sketches to textile engineering. This course focuses on the anatomy of fashion, garment construction techniques, and digital textile design. You will learn to translate creative vision into technical specification sheets (Tech Packs) required for modern apparel manufacturing and high-end atelier production.',
                category: 'Design',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1539109132314-d4a8c27a27b1',
                price: 1799,
                level: 'Beginner',
                duration: '14 Weeks',
                isPublished: true,
                chapters: [createChapter('Figure Drawing'), createChapter('Fabric & Textile'), createChapter('Garment Construction')],
                enrolledCount: 750
            },
            {
                title: 'Calligraphy & Lettering',
                description: 'Discover the rhythmic precision of traditional and modern script. This course focuses on the physics of the pen, ink consistency, and the historical foundations of Latin letterforms. You will develop the dexterity to create high-end custom lettering for editorial design, luxury packaging, and institutional branding.',
                category: 'Design',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27',
                price: 749,
                level: 'Beginner',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Brush Pen Basics'), createChapter('Traditional Copperplate'), createChapter('Modern Lettering')],
                enrolledCount: 1200
            },
            {
                title: 'Data Visualization Design',
                description: 'Engineering visual clarity from statistical complexity. This course teaches you to design sophisticated dashboards and communicative charts that drive institutional insights. You will learn to balance data density with visual accessibility, ensuring critical information is transmitted with maximum efficiency and zero ambiguity.',
                category: 'Design',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
                price: 1899,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Chart Selection'), createChapter('Dashboard Design'), createChapter('Interactive Viz')],
                enrolledCount: 1100
            }
        ];

        const businessCourses = [
            {
                title: 'Entrepreneurship 101',
                description: 'A strategic blueprint for the modern founder. This curriculum focuses on the methodology of lean startups, spanning from rapid market validation to sophisticated venture capital pitching. You will learn to architect scalable business models and navigate the complex legal and operational requirements of launching a high-growth institutional entity.',
                category: 'Business',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
                price: 999,
                level: 'Beginner',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Ideation & Validation'), createChapter('Business Planning'), createChapter('Pitching to Investors')],
                enrolledCount: 4500
            },
            {
                title: 'MBA in a Box: Management',
                description: 'A comprehensive distillation of the executive core. This course covers the intersection of operational strategy, corporate finance, and high-level marketing paradigms. Designed for emerging leaders, it provides the analytical tools required to manage complex organizational structures and drive institutional growth in a volatile global economy.',
                category: 'Business',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
                price: 1499,
                level: 'Intermediate',
                duration: '20 Weeks',
                isPublished: true,
                chapters: [createChapter('Strategy & Ops'), createChapter('Corporate Finance'), createChapter('Marketing Strategy')],
                enrolledCount: 3200
            },
            {
                title: 'Project Management Pro (PMP)',
                description: 'Engineered for precision in project delivery. This course deep-dives into the PMBOK framework, focusing on the strategic alignment of Agile, Scrum, and Waterfall methodologies. You will learn to manage risk vectors, optimize resource allocation, and ensure institutional standards of quality across complex, multi-stakeholder project environments.',
                category: 'Business',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
                price: 3500,
                level: 'Advanced',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Agile & Scrum'), createChapter('Risk Management'), createChapter('Quality Control')],
                enrolledCount: 2800
            },
            {
                title: 'Financial Analysis Masterclass',
                description: 'Master the technical engineering of financial models. This curriculum focuses on 3-statement modeling, Discounted Cash Flow (DCF) valuation, and sophisticated capital budgeting techniques. Students will use Excel to simulate corporate scenarios, providing the quantitative rigorousness required for high-stakes investment banking and corporate finance roles.',
                category: 'Business',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1543286386-713bdd548da4',
                price: 2799,
                level: 'Intermediate',
                duration: '14 Weeks',
                isPublished: true,
                chapters: [createChapter('3-Statement Models'), createChapter('DCF Valuation'), createChapter('Capital Budgeting')],
                enrolledCount: 1900
            },
            {
                title: 'Product Management Essentials',
                description: 'Bridge the gap between engineering, design, and business. This course focuses on the Product Lifecycle Management (PLM) process, from identifying ethnographic user needs to architecting high-fidelity product roadmaps. You will learn to write technical documentation (PRDs) and lead cross-functional squads through successful product launches.',
                category: 'Business',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
                price: 1200,
                level: 'Beginner',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('User Research'), createChapter('PRD Creation'), createChapter('Roadmapping')],
                enrolledCount: 2500
            },
            {
                title: 'Sales & Negotiation Mastery',
                description: 'The psychology and engineering of high-value deals. This course moves beyond basic pitching to explore consultative selling frameworks and sophisticated negotiation protocols. You will learn to manage complex objection matrices and close multi-faceted institutional agreements that build long-term economic value.',
                category: 'Business',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1427751364703-fe5833483b6d',
                price: 899,
                level: 'All Levels',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Consultative Selling'), createChapter('Objection Handling'), createChapter('Effective Closing')],
                enrolledCount: 1800
            },
            {
                title: 'Digital Marketing Excellence',
                description: 'Strategize and scale your digital presence. This course covers the intersection of data-driven SEO, performance-based SEM, and high-conversion content ecosystems. You will learn to architect automated marketing funnels that leverage machine learning algorithms for maximum institutional reach and ROI.',
                category: 'Business',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
                price: 949,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Market Funnels'), createChapter('Paid Search Ads'), createChapter('Conversion Optimization')],
                enrolledCount: 3100
            },
            {
                title: 'Leadership & Team Management',
                description: 'Architecting high-performance organizational cultures. This track focuses on the implementation of emotional intelligence, strategic conflict resolution, and performance coaching frameworks. You will learn to lead distributed teams through complex transformations while maintaining institutional alignment and operational velocity.',
                category: 'Business',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1522071823991-b967dc1f240c',
                price: 799,
                level: 'Intermediate',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Emotional Intelligence'), createChapter('Conflict Resolution'), createChapter('Performance Coaching')],
                enrolledCount: 2200
            },
            {
                title: 'Supply Chain Management',
                description: 'Engineering resilience and efficiency in global operations. This curriculum focuses on inventory optimization models, strategic logistics planning, and the risk management associated with global sourcing. Students will learn to leverage data analytics to build lean, responsive supply chains that withstand global economic volatility.',
                category: 'Business',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d',
                price: 1599,
                level: 'Advanced',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Inventory Control'), createChapter('Logistics Planning'), createChapter('Global Sourcing')],
                enrolledCount: 1400
            },
            {
                title: 'Business Analytics & BI',
                description: 'Driving institutional decisions through data-centric intelligence. We explore the technical stack of modern BI, from SQL-based data warehousing to high-fidelity visualization in Tableau and Power BI. You will learn to architect predictive forecasting models that translate raw data into strategic institutional advantages.',
                category: 'Business',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
                price: 1899,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('SQL for Business'), createChapter('Tableau/Power BI'), createChapter('Forecast Modeling')],
                enrolledCount: 1600
            }
        ];
        const dataScienceCourses = [
            {
                title: 'Data Science Bootcamp 2026',
                description: 'A comprehensive journey into the engineering of insights. This curriculum moves from foundational statistical theory to the technical implementation of advanced machine learning models using Python. You will master the entire data science lifecycle, focusing on high-fidelity data cleaning, exploratory analysis, and institutional-grade predictive deployment.',
                category: 'Data Science',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
                price: 2499,
                level: 'Beginner',
                duration: '24 Weeks',
                isPublished: true,
                chapters: [createChapter('Statistics for Data Science'), createChapter('Python for Data Analysis'), createChapter('Machine Learning Foundations')],
                enrolledCount: 5000
            },
            {
                title: 'Deep Learning with PyTorch',
                description: 'Engineering the future of artificial intelligence. This course focuses on the architectural design of neural networks—CNNs, RNNs, and Transformers—using the PyTorch framework. You will learn to leverage tensor computation and GPU acceleration to build models for computer vision and natural language processing at an institutional scale.',
                category: 'Data Science',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
                price: 3500,
                level: 'Advanced',
                duration: '16 Weeks',
                isPublished: true,
                chapters: [createChapter('Tensors & Gradients'), createChapter('CNNs for Computer Vision'), createChapter('RNNs & Transformers')],
                enrolledCount: 1200
            },
            {
                title: 'Big Data with Spark & Hadoop',
                description: 'Processing industrial-scale datasets with distributed computing architectures. This curriculum focuses on Apache Spark for high-speed data processing and Hadoop for scalable storage architectures. You will learn to architect sophisticated data pipelines that handle petabytes of information with maximum fault tolerance and institutional efficiency.',
                category: 'Data Science',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1558494943-030571d70ed2',
                price: 2999,
                level: 'Intermediate',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Distributed Computing'), createChapter('Spark SQL & Dataframes'), createChapter('Streaming Data')],
                enrolledCount: 900
            },
            {
                title: 'Natural Language Processing (NLP)',
                description: 'Technical mastery of computational linguistics. This course explores the implementation of BERT, GPT, and Transformer architectures to build machines that understand and generate human language. You will learn sophisticated tokenization techniques, sentiment analysis protocols, and the deployment of production-grade language models.',
                category: 'Data Science',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
                price: 2100,
                level: 'Advanced',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Tokenization & Stemming'), createChapter('Word Embeddings'), createChapter('BERT & GPT Models')],
                enrolledCount: 1500
            },
            {
                title: 'R for Statistical Computing',
                description: 'Master the technical syntax of institutional statistical analysis. This curriculum focuses on R’s ecosystem for data manipulation and visualization, utilizing Tidyverse and ggplot2 for high-fidelity analytical reporting. Designed for researchers and analysts who require the quantitative precision of R for complex datasets.',
                category: 'Data Science',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
                price: 999,
                level: 'Beginner',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('R Syntax & Vectors'), createChapter('ggplot2 Visualization'), createChapter('Tidyverse Functions')],
                enrolledCount: 2200
            },
            {
                title: 'Data Engineering Masterclass',
                description: 'The architectural backbone of modern data systems. This course focuses on building robust ETL pipelines, managing high-throughput data warehouses like Snowflake, and orchestrating complex workflows with Airflow. You will learn to ensure data integrity and availability across institutional data infrastructures.',
                category: 'Data Science',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
                price: 3299,
                level: 'Intermediate',
                duration: '18 Weeks',
                isPublished: true,
                chapters: [createChapter('ETL Processes'), createChapter('Data Warehousing (Snowflake)'), createChapter('Airflow Orchestration')],
                enrolledCount: 1100
            },
            {
                title: 'Time Series Analysis & Forecasting',
                description: 'Predictive engineering through longitudinal data analysis. Learn to implement ARIMA, SARIMA, and Facebook Prophet models to forecast institutional metrics with mathematical precision. This course focuses on identifying stationarity patterns and seasonal trends in high-frequency financial and operational datasets.',
                category: 'Data Science',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1543286386-713bdd548da4',
                price: 1899,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Stationarity & Seasonality'), createChapter('ARIMA & SARIMA'), createChapter('Prophet Forecasting')],
                enrolledCount: 850
            },
            {
                title: 'Tableau for Data Visualization',
                description: 'Architecting interactive intelligence through visual design. We explore the high-end capabilities of Tableau for connecting to industrial data sources and creating sophisticated business dashboards. You will learn to use calculated fields and storytelling protocols to drive data-centric institutional decisions.',
                category: 'Data Science',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
                price: 749,
                level: 'Beginner',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Connecting to Data'), createChapter('Calculated Fields'), createChapter('Storytelling with Data')],
                enrolledCount: 3500
            },
            {
                title: 'SQL for Data Science',
                description: 'The technical foundation of data retrieval and manipulation. Master advanced joins, window functions, and query optimization protocols for large-scale databases. This course focuses on using SQL to engineer analytical datasets that serve as the foundation for institutional machine learning and BI workflows.',
                category: 'Data Science',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2',
                price: 599,
                level: 'Beginner',
                duration: '4 Weeks',
                isPublished: true,
                chapters: [createChapter('Joins & Subqueries'), createChapter('Window Functions'), createChapter('Query Optimization')],
                enrolledCount: 6000
            },
            {
                title: 'Data Ethics & Privacy',
                description: 'Navigating the institutional risks of data-driven systems. We explore the legal and ethical implications of Algorithmic Bias, GDPR compliance, and advanced secure data handling protocols. Essential for data professionals committed to responsible innovation and institutional integrity.',
                category: 'Data Science',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d',
                price: 1200,
                level: 'All Levels',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('GDPR & CCPA'), createChapter('Algorithmic Bias'), createChapter('Secure Data Handling')],
                enrolledCount: 700
            }
        ];

        const marketingCourses = [
            {
                title: 'Digital Marketing Mastery',
                description: 'The definitive architectural guide to high-conversion online ecosystems. This curriculum focuses on the strategic deployment of multi-channel marketing funnels, leveraging advanced data analysis and predictive performance modeling. You will learn to orchestrate complex digital campaigns that drive institutional visibility and achieve scalable user acquisition metrics.',
                category: 'Marketing',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
                price: 1499,
                level: 'Beginner',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Marketing Fundamentals'), createChapter('Customer Avatars'), createChapter('The Marketing Funnel')],
                enrolledCount: 8000
            },
            {
                title: 'Advanced SEO Strategies',
                description: 'Master the technical engineering of organic search visibility. This course deep-dives into the algorithms of modern search engines, focusing on semantic indexing, technical site architecture, and high-fidelity backlink ecosystem design. You will learn to navigate the complexities of search intent and drive sustainable, institutional traffic through strategic optimization.',
                category: 'Marketing',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f',
                price: 1899,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('On-Page Optimization'), createChapter('Technical SEO'), createChapter('Backlink Building')],
                enrolledCount: 4500
            },
            {
                title: 'Social Media Management',
                description: 'Strategic engineering of digital social equity. We explore the architectural nuances of various social platforms—IG, TikTok, and LinkedIn—focusing on rhythmic content cycles and community management protocols. You will learn to leverage platform-specific algorithms to build high-fidelity brand authority and institutional engagement ecosystems.',
                category: 'Marketing',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
                price: 949,
                level: 'Beginner',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Content Creation'), createChapter('Platform Algorithms'), createChapter('Engagement Strategies')],
                enrolledCount: 12000
            },
            {
                title: 'Facebook & Instagram Ads',
                description: 'Mastering the economics of paid social advertising. This course focuses on the technical stack of Meta Ads Manager, from high-fidelity audience segmentation using pixel-based event tracking to sophisticated retargeting architectures. You will learn to optimize ad spend through machine learning-driven bidding strategies and creative performance analysis.',
                category: 'Marketing',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1611162616305-9b7a3293812b',
                price: 2100,
                level: 'Intermediate',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Ad Manager Setup'), createChapter('Retargeting Pixels'), createChapter('Scaling Campaigns')],
                enrolledCount: 5500
            },
            {
                title: 'Content Marketing Strategy',
                description: 'Creating high-impact narrative systems for institutional growth. Learn to engineer content that serves as a strategic asset throughout the user journey. This course explores editorial planning, rhythmic distribution strategies, and high-fidelity conversion copywriting designed to turn readers into loyal institutional advocates.',
                category: 'Marketing',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1499750310117-599d870e097d',
                price: 1100,
                level: 'Beginner',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Blogging for Business'), createChapter('Video Marketing'), createChapter('Email Newsletters')],
                enrolledCount: 3800
            },
            {
                title: 'Email Marketing Automations',
                description: 'Architecting high-conversion retention ecosystems. Focus on the implementation of sophisticated automated drip campaigns and rhythmic email newsletters. You will master audience segmentation logic, A/B testing protocols, and the technical delivery infrastructure required to maintain institutional engagement at scale.',
                category: 'Marketing',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3',
                price: 1599,
                level: 'Intermediate',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('List Segmentation'), createChapter('Drip Campaigns'), createChapter('AB Testing')],
                enrolledCount: 2200
            },
            {
                title: 'Google Ads (SEM) Masterclass',
                description: 'Strategic engineering of high-intent search advertising. Master Google’s auction dynamics, from keyword research and quality score optimization to sophisticated bidding algorithms. This curriculum focuses on building high-performance Search, Display, and Video campaigns that drive measurable institutional growth.',
                category: 'Marketing',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
                price: 1999,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Keyword Research'), createChapter('Quality Score'), createChapter('Bidding Strategies')],
                enrolledCount: 3400
            },
            {
                title: 'Influencer Marketing Guide',
                description: 'Leveraging digital social capital for institutional expansion. Learn the technical protocols for identifying, vetting, and managing high-fidelity influencer partnerships. We explore contract negotiation strategies, compliance frameworks, and ROI tracking models for modern creator-led marketing initiatives.',
                category: 'Marketing',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1628191139360-4083564d03fd',
                price: 1200,
                level: 'All Levels',
                duration: '4 Weeks',
                isPublished: true,
                chapters: [createChapter('Finding the Right Fit'), createChapter('Contract Negotiation'), createChapter('ROI Tracking')],
                enrolledCount: 1500
            },
            {
                title: 'Affiliate Marketing Secrets',
                description: 'Engineering scalable passive revenue streams through digital partnerships. This course focuses on niche selection, authority site architecture, and the strategic management of high-fidelity affiliate networks. Learn to build automated content funnels that drive sustainable economic value across diverse digital ecosystems.',
                category: 'Marketing',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1557838923-2985c318be48',
                price: 849,
                level: 'Beginner',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Niche Selection'), createChapter('Authority Sites'), createChapter('Amazon Associates')],
                enrolledCount: 9000
            },
            {
                title: 'Brand Storytelling & PR',
                description: 'The architectural design of brand equity and public perception. Focus on the technical skill of narrative engineering, crisis management protocols, and high-impact press communication. You will learn to protect and expand institutional reputation through strategic messaging and cohesive identity systems.',
                category: 'Marketing',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f',
                price: 1350,
                level: 'Intermediate',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Core Values'), createChapter('Crisis Management'), createChapter('Press Releases')],
                enrolledCount: 2100
            }
        ];
        const photographyCourses = [
            {
                title: 'Photography Masterclass',
                description: 'The definitive architectural study of high-fidelity visual capture. Master the technical physics of light through the Exposure Triangle (Aperture, Shutter, ISO) and the sophisticated management of natural and studio lighting systems. Develop a professional non-destructive editing workflow using Adobe Lightroom to achieve museum-quality visual results.',
                category: 'Photography',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
                price: 849,
                level: 'Beginner',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('The Exposure Triangle'), createChapter('Professional Lighting'), createChapter('Adobe Lightroom Workflow')],
                enrolledCount: 5500
            },
            {
                title: 'iPhone Photography Academy',
                description: 'Engineering high-fidelity visual narrative through mobile infrastructure. This course explores the advanced computational photography features of the Apple ecosystem, focusing on professional-level mobile composition and non-destructive post-processing on the go. Master the art of achieving cinematic quality using portable institutional tech.',
                category: 'Photography',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
                price: 525,
                level: 'All Levels',
                duration: '4 Weeks',
                isPublished: true,
                chapters: [createChapter('Hidden Camera Features'), createChapter('Mobile Composition'), createChapter('Editing on the Go')],
                enrolledCount: 12000
            },
            {
                title: 'Portrait Photography Mastery',
                description: 'The technical engineering of human social identity. Master the rhythmic direction of subjects, high-end studio lighting architectures, and non-destructive skin retouching protocols designed for high-fidelity editorial and commercial output. This curriculum focuses on the psychological and aesthetic synchronization between photographer and talent.',
                category: 'Photography',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
                price: 1299,
                level: 'Intermediate',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Posing & Direction'), createChapter('Skin Retouching'), createChapter('Studio Lighting')],
                enrolledCount: 3200
            },
            {
                title: 'Landscape & Nature Photography',
                description: 'Capturing the high-fidelity geometry of the natural world. This course focuses on the strategic planning of shoots around "Golden Hour" physics, the implementation of long-exposure techniques for water and sky, and the non-destructive post-processing protocols required to maintain institutional-grade dynamic range in environmental visuals.',
                category: 'Photography',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
                price: 999,
                level: 'Beginner',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Golden Hour Essentials'), createChapter('Long Exposure Techniques'), createChapter('Post-Processing Landscapes')],
                enrolledCount: 4100
            },
            {
                title: 'Street Photography: Urban Stories',
                description: 'The technical documentation of urban ethnographic moments. Master the art of candid visual acquisition focusing on geometric composition, advanced layering techniques, and the rhythmic timing required for high-impact social commentary. This course includes professional black-and-white tonal management for timeless visual results.',
                category: 'Photography',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1492691523567-61709d1aa321',
                price: 749,
                level: 'Intermediate',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Candid Shooting'), createChapter('Geometry & Layers'), createChapter('Black & White Editing')],
                enrolledCount: 2500
            },
            {
                title: 'Wedding Photography Business',
                description: 'Architecting a profitable high-fidelity wedding brand. Master the complex event workflow of ceremony documentation, the strategic marketing of premium visual services, and the high-level client management protocols required for institutional success in the luxury event market. Focus on building a resilient, high-margin creative enterprise.',
                category: 'Photography',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
                price: 1899,
                level: 'Advanced',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Event Workflow'), createChapter('Marketing Your Services'), createChapter('Client Management')],
                enrolledCount: 1500
            },
            {
                title: 'Adobe Lightroom Mastery',
                description: 'The exhaustive guide to high-fidelity non-destructive editing. Master Lightroom’s technical stack, from library management and metadata architecture to advanced color grading and systemic batching workflows. This course is for photographers seeking to maintain institutional-grade quality throughout their visual asset lifecycles.',
                category: 'Photography',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
                price: 649,
                level: 'Beginner',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Library & Develop Modules'), createChapter('Color Grading'), createChapter('Presets & Batching')],
                enrolledCount: 6000
            },
            {
                title: 'Night & Astrophotography',
                description: 'The technical engineering of long-exposure celestial capture. Learn to manage high-ISO noise reduction architectures, master the physics of star trail movement, and achieve high-fidelity capture of the Milky Way using advanced tracking mounts and specialized post-processing protocols for deep-sky visual fidelity.',
                category: 'Photography',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
                price: 1100,
                level: 'Advanced',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Milky Way Shooting'), createChapter('Star Trails'), createChapter('Noise Reduction')],
                enrolledCount: 1800
            },
            {
                title: 'Food Photography & Styling',
                description: 'Architecting high-fidelity visual desire. Master the technical styling of culinary entities, the implementation of natural lighting for texture enhancement, and professional social media post-processing. This curriculum focuses on achieving the premium visual aesthetic required for high-end editorial and commercial food documentation.',
                category: 'Photography',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327',
                price: 899,
                level: 'Intermediate',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Plate Styling'), createChapter('Natural Light for Food'), createChapter('Social Media Presets')],
                enrolledCount: 2200
            },
            {
                title: 'Film Photography & Development',
                description: 'The technical study of traditional chemical visual capture. Discover the magic of analog engineering focusing on diverse film grain characters, traditional darkroom development protocols, and high-fidelity scanning for digital archival integration. Master the art of achieving a timeless institutional aesthetic through analog physics.',
                category: 'Photography',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9',
                price: 1350,
                level: 'All Levels',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Film Types'), createChapter('Lab Development'), createChapter('Scanning & Printing')],
                enrolledCount: 900
            }
        ];

        const musicCourses = [
            {
                title: 'Music Production with Ableton',
                description: 'Engineering high-fidelity sonic landscapes within Ableton Live. Master the technical stack of modern music production, focusing on MIDI orchestration, sophisticated audio FX architectures, and high-end arrangement strategies. Learn to achieve institutional-level sonic clarity through strategic mixing and mastering protocols.',
                category: 'Music',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
                price: 1099,
                level: 'Beginner',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Ableton Interface'), createChapter('MIDI & Audio FX'), createChapter('Arrangement Basics')],
                enrolledCount: 4500
            },
            {
                title: 'Piano Mastery: Zero to Hero',
                description: 'The technical and ergonomic foundation of classical and modern piano. Focus on hand positioning physics, rhythmic chord architectures, and high-fidelity scale integration. You will learn to play by ear and read institutional sheet music, developing the dexterity required for professional-level performance in a fraction of traditional timelines.',
                category: 'Music',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1520529612224-dbe759f2010a',
                price: 675,
                level: 'Beginner',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Hand Positioning'), createChapter('Chords & Scales'), createChapter('Playing by Ear')],
                enrolledCount: 15000
            },
            {
                title: 'Guitar for Absolute Beginners',
                description: 'Master the technical engineering of the fretboard. This curriculum focuses on basic open chord architectures, rhythmic strumming patterns, and high-fidelity tab reading protocols. Develop the physical muscle memory required for professional-level song execution while maintaining institutional standards of technique and tone.',
                category: 'Music',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1510915367610-22c66c3c5861',
                price: 599,
                level: 'Beginner',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Basic Open Chords'), createChapter('Strumming Patterns'), createChapter('Reading Tabs')],
                enrolledCount: 12000
            },
            {
                title: 'Vocal Mastery & Technique',
                description: 'Engineering the human voice for professional performance. Master the physics of breath support, the technical extension of your vocal range, and institutional-grade vocal health protocols. You will develop a unique sonic identity while maintaining the physical integrity required for long-term vocal sustainability.',
                category: 'Music',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
                price: 625,
                level: 'All Levels',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Breath Support'), createChapter('Expanding Range'), createChapter('Vocal Health')],
                enrolledCount: 8000
            },
            {
                title: 'Electronic Music (EDM) Design',
                description: 'Master the technical engineering of synthesizers and rhythmic sound design. Focus on the architecture of Wavetable and Subtractive synthesis, high-end drum programming, and the implementation of sophisticated modulation matrices. Learn to build institutional-grade tracks for the modern digital dance floor.',
                category: 'Music',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
                price: 1450,
                level: 'Intermediate',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Wavetable Synthesis'), createChapter('Drum Programming'), createChapter('Modulation Matrices')],
                enrolledCount: 1560
            },
            {
                title: 'Hip-Hop Beat Making',
                description: 'Create trap, lo-fi, and boom-bap beats.',
                category: 'Music',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9',
                price: 899,
                level: 'Intermediate',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Sample Chopping'), createChapter('808 Design'), createChapter('Groove & Swing')],
                enrolledCount: 5500
            },
            {
                title: 'Mixing & Mastering Pro',
                description: 'Give your tracks a professional polish.',
                category: 'Music',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
                price: 1999,
                level: 'Advanced',
                duration: '14 Weeks',
                isPublished: true,
                chapters: [createChapter('EQ & Dynamics'), createChapter('Spatial Effects'), createChapter('Loudness Standards')],
                enrolledCount: 2200
            },
            {
                title: 'Songwriting & Composition',
                description: 'Tell your story through music.',
                category: 'Music',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1459749411177-042180ce673c',
                price: 799,
                level: 'All Levels',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Melody Writing'), createChapter('Lyric Structure'), createChapter('Arranging for Bands')],
                enrolledCount: 2800
            },
            {
                title: 'Music Theory for Modern Producers',
                description: 'Understand the "why" behind the music.',
                category: 'Music',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76',
                price: 499,
                level: 'Beginner',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Intervals & Scales'), createChapter('Chord Progressions'), createChapter('Rhythm & Meter')],
                enrolledCount: 6500
            },
            {
                title: 'DJ Masterclass: Club & Festival',
                description: 'Master the decks and read the crowd.',
                category: 'Music',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
                price: 1200,
                level: 'Intermediate',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Beatmatching'), createChapter('FX & Looping'), createChapter('Building a Setlist')],
                enrolledCount: 1900
            }
        ];

        const aiMLCourses = [
            {
                title: 'AI Foundations 2026',
                description: 'The architectural cornerstone of artificial intelligence. This curriculum traverses the historical evolution of AI, focusing on the mathematical frameworks of supervised and unsupervised learning algorithms. Students will develop an institutional-grade understanding of neural architectures and the strategic implementation of AI across diverse digital ecosystems.',
                category: 'AI & ML',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
                price: 1999,
                level: 'Beginner',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Intro to AI History'), createChapter('Supervised vs Unsupervised'), createChapter('The Future of AI')],
                enrolledCount: 8500
            },
            {
                title: 'Generative AI & LLMs',
                description: 'Mastering the engineering of synthetic intelligence. This course focuses on the architecture of Large Language Models (LLMs) and Diffusion models, from prompt engineering protocols to high-fidelity model fine-tuning. You will learn to build and deploy generative systems that redefine institutional creative and analytical workflows.',
                category: 'AI & ML',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1675557009875-436f595b1611',
                price: 2499,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('Prompt Engineering'), createChapter('Fine-tuning Models'), createChapter('AI Ethics')],
                enrolledCount: 6200
            },
            {
                title: 'Computer Vision Mastery',
                description: 'Teaching machines high-fidelity visual recognition. This curriculum focuses on the implementation of convolutional neural networks (CNNs) for object detection and face recognition at scale. You will leverage the YOLO framework and OpenCV to build institutional-grade visual intelligence systems capable of real-time environmental analysis.',
                category: 'AI & ML',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
                price: 2999,
                level: 'Advanced',
                duration: '14 Weeks',
                isPublished: true,
                chapters: [createChapter('Image Processing'), createChapter('Object Detection (YOLO)'), createChapter('Face Recognition')],
                enrolledCount: 1500
            },
            {
                title: 'Reinforcement Learning Pro',
                description: 'Building autonomous systems through interactive intelligence. This course explores the physics of Markov Decision Processes and the architectural design of Deep Q-Networks. You will learn to engineer AI agents that optimize institutional decision-making through complex trial-and-error simulations in high-stakes digital environments.',
                category: 'AI & ML',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
                price: 3500,
                level: 'Advanced',
                duration: '16 Weeks',
                isPublished: true,
                chapters: [createChapter('Markov Decision Processes'), createChapter('Q-Learning'), createChapter('Deep Q-Networks')],
                enrolledCount: 900
            },
            {
                title: 'AI for Business Leaders',
                description: 'The strategic engineering of AI ROI. This curriculum focuses on the institutional implementation of AI strategies, from managing cross-functional AI squads to architecting data governance frameworks. Designed for executives who require a technical and economic understanding of AI to maintain institutional competitive advantages.',
                category: 'AI & ML',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
                price: 1599,
                level: 'All Levels',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('AI ROI Analysis'), createChapter('Managing AI Teams'), createChapter('Data Strategy')],
                enrolledCount: 3100
            },
            {
                title: 'Machine Learning Operations (MLOps)',
                description: 'The architectural backbone of production AI. Focus on the end-to-end lifecycle of machine learning models, from containerized deployment to real-time drift monitoring. You will learn to implement CI/CD for ML pipelines, ensuring institutional-grade reliability and scalability for decentralized AI infrastructures.',
                category: 'AI & ML',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
                price: 3299,
                level: 'Advanced',
                duration: '12 Weeks',
                isPublished: true,
                chapters: [createChapter('Model Versioning'), createChapter('Monitoring Drift'), createChapter('CI/CD for ML')],
                enrolledCount: 1100
            },
            {
                title: 'AI Chatbot Development',
                description: 'Building sentient digital assistants with OpenAI and Rasa architectures. This course focuses on NLU (Natural Language Understanding) protocols, intent recognition logic, and sophisticated entity extraction techniques. You will learn to architect intelligent chat systems that drive institutional engagement and automate complex user support matrixes.',
                category: 'AI & ML',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
                price: 1100,
                level: 'Intermediate',
                duration: '8 Weeks',
                isPublished: true,
                chapters: [createChapter('Intent Recognition'), createChapter('Entity Extraction'), createChapter('API Integrations')],
                enrolledCount: 4200
            },
            {
                title: 'Robotics & AI Control',
                description: 'Engineering intelligent control systems for physical robotic entities. Master the ROS (Robot Operating System) ecosystem, focusing on path planning algorithms and high-fidelity sensor fusion architectures. This track provides the technical foundation for building machines that navigate and interact with the physical world through AI-driven logic.',
                category: 'AI & ML',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
                price: 3999,
                level: 'Advanced',
                duration: '18 Weeks',
                isPublished: true,
                chapters: [createChapter('ROS Integration'), createChapter('Path Planning'), createChapter('Sensor Fusion')],
                enrolledCount: 750
            },
            {
                title: 'AI Art & Creativity',
                description: 'Navigating the intersection of synthetic intelligence and artistic expression. This course explores the high-fidelity capabilities of Stable Diffusion and LoRA for professional-grade visual generation. Learn to utilize AI as a collaborative tool in cinema and digital design while maintaining institutional control over creative output.',
                category: 'AI & ML',
                faculty: faculty1,
                thumbnail: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d',
                price: 799,
                level: 'Beginner',
                duration: '6 Weeks',
                isPublished: true,
                chapters: [createChapter('Stable Diffusion'), createChapter('ControlNet & LoRA'), createChapter('AI in Cinema')],
                enrolledCount: 5500
            },
            {
                title: 'Explainable AI (XAI)',
                description: 'Engineering transparency in black-box neural architectures. Master SHAP and LIME protocols to understand and communicate the logic behind AI decision-making. Essential for maintaining institutional trust and regulatory compliance in high-stakes machine learning applications, focusing on model interpretability and bias mitigation.',
                category: 'AI & ML',
                faculty: faculty2,
                thumbnail: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1',
                price: 2100,
                level: 'Intermediate',
                duration: '10 Weeks',
                isPublished: true,
                chapters: [createChapter('SHAP & LIME'), createChapter('Model Transparency'), createChapter('Trust in AI')],
                enrolledCount: 1300
            }
        ];

        const allCourses = [
            ...devCourses,
            ...designCourses,
            ...businessCourses,
            ...dataScienceCourses,
            ...marketingCourses,
            ...photographyCourses,
            ...musicCourses,
            ...aiMLCourses
        ];

        await Course.insertMany(allCourses);
        console.log(`Successfully Imported ${allCourses.length} Courses!`);
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
    if (process.argv[2] === '-d') destroyData();
    else importData();
}

module.exports = { importData, destroyData };
