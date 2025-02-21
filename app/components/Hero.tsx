'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const Hero = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-[#585785] mb-6">
                Call Of Diagnosis
            </h1>
            
            <div className="space-y-4 mb-12">
                <p className="text-lg text-gray-600">
                    Help us improve our new AI models to build synthetic images.
                </p>
                <p className="text-lg text-[#8286af]">
                    Fun. Creative. Competitive
                </p>
            </div>

            <div className="flex gap-6">
                <button className="px-10 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center">
                    Get started
                    <FontAwesomeIcon
                        icon={faChevronRight}
                        className="w-4 h-4 ml-2"
                    />
                </button>
                
                <button className="px-10 py-3 bg-[var(--heartflow-red)] text-white rounded-3xl hover:bg-[var(--heartflow-red)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                    Admin
                </button>
            </div>
        </div>
    )
}

export default Hero