
import Footer from '../Component/Footer';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Component/Navbar';

const Philosophy = () => {

  const navigate=useNavigate()
  const principles = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      ),
      title: "Sophistication in Simplicity",
      description: "We strip away the superfluous to reveal the profound. Each note is chosen with intention, each composition balanced for clarity."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Timeless Beauty",
      description: "ZYRAE exists outside of trends. We seek the beauty that does not age—the quiet grace that feels both familiar and utterly new."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      title: "Emotional Connection",
      description: "A ZYRAE scent is a subtle embrace, an emotional anchor crafted to connect you to your inner calm and confidence."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: "Purity of Essence",
      description: "We honor raw authenticity. Every ingredient is selected for its natural integrity, creating scents of remarkable transparency."
    }
  ];

  const QuoteIcon = () => (
    <svg className="w-12 h-12 text-[#A79277]/40 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );

  const StarIcon = () => (
    <svg className="w-8 h-8 text-[#D1BB9E] mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#FFF2E1] text-[#5A5347]">
      
      <section className="relative pt-20 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-light tracking-widest text-[#A79277] mb-4">
            ZYRAE
          </h1>
          <p className="text-xl md:text-2xl italic tracking-widest text-[#D1BB9E] mb-8">
            The Poetry of You
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#A79277] to-transparent mx-auto"></div>
        </div>
      </section>

  
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl leading-relaxed text-[#6B6152] mb-8">
            In a world of noise, we choose the whisper. In an age of excess, we honor the essential.
          </p>
          <p className="text-lg text-[#7A6F5E]">
            ZYRAE is not merely a perfume; it is a quiet space, a breath held in reverence, 
            a memory translated into scent.
          </p>
        </div>
      </section>

  
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center text-[#8B7A62] mb-12 tracking-wide">
            The Philosophy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Our philosophy is built on the belief that true luxury is felt, not displayed. 
                It is an intimate dialogue between soul and skin—a confidence that blooms from within.
              </p>
              <p className="text-lg leading-relaxed">
                We craft for the individual, not the crowd. Each fragrance is designed to become 
                a personal signature that evolves with your skin and deepens with your moments.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                ZYRAE perfumes are whispers of subtle luxury—nuanced impressions that speak of 
                quiet confidence and refined sensibility.
              </p>
              <p className="text-lg leading-relaxed">
                They are not masks, but mirrors; not adornments, but atmospheres that cultivate 
                an inner landscape of timeless beauty.
              </p>
            </div>
          </div>

          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {principles.map((principle, index) => (
              <div 
                key={index}
                className="group bg-white/30 backdrop-blur-sm p-8 rounded-lg border border-[#EAD8C0]/50 
                         hover:border-[#A79277]/30 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-[#A79277] mb-6 group-hover:scale-110 transition-transform duration-300">
                  {principle.icon}
                </div>
                <h3 className="text-xl font-light text-[#8B7A62] mb-4">
                  {principle.title}
                </h3>
                <p className="text-[#7A6F5E] leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#EAD8C0]/20 p-12 rounded-2xl text-center">
            <QuoteIcon />
            <p className="text-2xl md:text-3xl font-light italic text-[#6B6152] mb-8 leading-relaxed">
              "Sophistication is not about being noticed. It's about being remembered."
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {['Subtle Luxury', 'Personal Signature', 'Emotional Resonance', 'Timeless Grace'].map((value, index) => (
                <span 
                  key={index}
                  className="px-6 py-3 border border-[#D1BB9E] text-[#8B7A62] rounded-full text-sm tracking-wide"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative mb-12">
            <StarIcon />
            <h3 className="text-2xl font-light text-[#A79277] mb-8">
              The ZYRAE Experience
            </h3>
          </div>
          <p className="text-xl leading-relaxed text-[#6B6152] mb-10">
            To wear ZYRAE is to cultivate an inner landscape of timeless beauty—
            a personal haven of sophistication that moves with you, intimately and unmistakably yours.
          </p>
          <button className="px-10 py-4 border border-[#A79277] text-[#A79277] tracking-widest 
                          hover:bg-[#A79277] hover:text-white transition-all duration-300 
                          text-sm font-light"
                          onClick={() => navigate("/products")}>
            DISCOVER OUR SCENTS
          </button>
        </div>
      </section>
      <Footer />
    </div>
    </>

  );
  
};
  
export default Philosophy;