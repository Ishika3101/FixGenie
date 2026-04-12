import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const services = [
    { name: "Plumbing", icon: "/Plumbing.png", desc: "Pipes, leaks & installations" },
    { name: "Electrical", icon: "/Electrical.png", desc: "Wiring, fitting & repairs" },
    { name: "Cleaning", icon: "/Cleaning.png", desc: "Deep clean & sanitization" },
    { name: "Carpentry", icon: "/Carpentry.png", desc: "Furniture & woodwork" },
    { name: "Painting", icon: "/Painting.png", desc: "Interior & exterior painting" },
    { name: "AC Repair", icon: "/AC Repair.png", desc: "Service, repair & installation" },
]

const Home = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-purple-950 min-h-screen flex flex-col items-center justify-center text-center px-6">
                <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                    Your Trusted Home Service Partner
                </h1>
                <p className="text-purple-300 text-xl mb-8 max-w-2xl">
                    Book verified professionals for plumbing, electrical, cleaning and more — at your doorstep!
                </p>
                {user?.role === "provider" ? (
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-yellow-400 text-purple-950 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition duration-300 text-lg"
                    >
                        Go to Dashboard
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/providers')}
                        className="bg-yellow-400 text-purple-950 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition duration-300 text-lg"
                    >
                        Book a Service
                    </button>
                )}
            </div>

            {/* Services Section */}
            {user?.role === 'provider' ? (
                <div className="text-center py-16 bg-gray-50">
                    <h2 className="text-3xl font-bold text-purple-950 mb-4">Ready to start earning?</h2>
                    <p className="text-gray-500 mb-8">Complete your profile to start receiving bookings</p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="bg-purple-950 text-white font-bold px-8 py-3 rounded-full hover:bg-purple-800 transition duration-300"
                    >
                        Complete Profile
                    </button>
                </div>
            ) : (
                <div className="bg-gray-50 px-16 pt-20 pb-10">
                    <h2 className="text-3xl font-bold text-purple-950 mb-2">What are you looking for?</h2>
                    <p className="text-gray-500 mb-10">Trusted professionals for every home need</p>
                    <div className="flex gap-10 items-center">
                        <div className="grid grid-cols-2 gap-6 w-1/2">
                            {services.map((service) => (
                                <div key={service.name} className="bg-white rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg hover:border-l-4 hover:border-yellow-400 transition-all duration-300 cursor-pointer border border-gray-100">
                                    <img src={service.icon} alt={service.name} className="w-10 h-10" />
                                    <div>
                                        <p className="text-purple-950 font-bold text-lg">{service.name}</p>
                                        <p className="text-gray-500 text-sm">{service.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-1/2">
                            <img src="/services.png" alt="Services" className="w-full h-full object-cover rounded-3xl" />
                        </div>
                    </div>
                </div>
            )}

            {/* How it works */}
            {user?.role === 'provider' ? (
                <div className="bg-white px-16 py-20 text-center">
                    <h2 className="text-3xl font-bold text-purple-950 mb-2">How it works</h2>
                    <p className="text-gray-500 mb-14">Start earning in 3 simple steps</p>
                    <div className="flex justify-between items-start gap-8">
                        {[
                            { step: "01", title: "Complete Profile", desc: "Add your skills, city and bio" },
                            { step: "02", title: "Get Verified", desc: "Admin will verify your profile" },
                            { step: "03", title: "Start Earning", desc: "Accept bookings and grow!" },
                        ].map((item) => (
                            <div key={item.step} className="flex-1 flex flex-col items-center">
                                <div className="bg-purple-950 text-yellow-400 font-extrabold text-2xl w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-purple-950 font-bold text-xl mb-2">{item.title}</h3>
                                <p className="text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white px-16 py-20 text-center">
                    <h2 className="text-3xl font-bold text-purple-950 mb-2">How it works</h2>
                    <p className="text-gray-500 mb-14">Get your service done in 3 simple steps</p>
                    <div className="flex justify-between items-start gap-8">
                        {[
                            { step: "01", title: "Choose a Service", desc: "Browse from our wide range of home services" },
                            { step: "02", title: "Book an Expert", desc: "Pick a time slot that works for you" },
                            { step: "03", title: "Get it Done", desc: "Our verified professional arrives at your door" },
                        ].map((item) => (
                            <div key={item.step} className="flex-1 flex flex-col items-center">
                                <div className="bg-purple-950 text-yellow-400 font-extrabold text-2xl w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-purple-950 font-bold text-xl mb-2">{item.title}</h3>
                                <p className="text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default Home