import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { DetoxProtocol } from '@/components/sections/DetoxProtocol'
import { Services } from '@/components/sections/Services'
import { Products } from '@/components/sections/Products'
import { Testimonials } from '@/components/sections/Testimonials'

const Index = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <About />
      <DetoxProtocol />
      <Services />
      <Products />
      <Testimonials />
    </div>
  )
}

export default Index
