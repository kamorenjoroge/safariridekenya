import CarGrid from "./components/CarGrid"
import Hero from "./components/Hero"
import Testimonials from "./components/Testimonials"
import WhyUs from "./components/WhyUs"

const Page = () => {
  return (
    <div className=''>
      <Hero/>
      <CarGrid/>
      <WhyUs/>
      <Testimonials/>
    </div>
  )
}

export default Page