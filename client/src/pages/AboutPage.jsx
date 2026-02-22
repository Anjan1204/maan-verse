import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Book, Trophy } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { label: 'Students', value: '10k+', icon: Users },
    { label: 'Courses', value: '80+', icon: Book },
    { label: 'Instructors', value: '50+', icon: Target },
    { label: 'Awards', value: '15+', icon: Trophy },
  ];

  const team = [
    { name: 'Shah Mahek', role: 'Founder & CEO', image: '/assets/mahek.jpeg' },
    { name: 'Anjani Kumar', role: 'Co-Founder & CTO', image: '/assets/anjani.jpeg' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-gradient">MAAN-verse</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We are on a mission to democratize education. MAAN-verse is more than just an LMS; it's a community of learners, dreamers, and achievers.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl text-center hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <stat.icon size={24} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <div className="glass rounded-3xl p-8 md:p-12 mb-20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Education is the key to unlocking human potential. We believe that everyone, everywhere, deserves access to world-class learning resources.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Founded by Mahek and Anjan, MAAN-verse combines cutting-edge technology with pedagogical excellence to create learning experiences that stick.
              </p>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl transform rotate-3 blur-lg opacity-50"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Team collaboration"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>

        {/* Team */}
        <h2 className="text-3xl font-bold text-white text-center mb-12">Meet the Team</h2>

        <div className="flex flex-wrap justify-center gap-4">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center group"
            >
              <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>

                <div className="relative w-full h-full rounded-full border-4 border-surface shadow-xl overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              <p className="text-primary font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
