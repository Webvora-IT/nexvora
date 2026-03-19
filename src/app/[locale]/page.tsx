import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Pricing from '@/components/Pricing'
import About from '@/components/About'
import Team from '@/components/Team'
import Testimonials from '@/components/Testimonials'
import BlogPreview from '@/components/BlogPreview'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <Pricing />
      <About />
      <Team />
      <Testimonials />
      <BlogPreview />
      <Contact />
      <Footer />
    </main>
  )
}
