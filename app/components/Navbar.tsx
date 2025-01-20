'use client'
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

// Add icons to library
library.add(faLock)

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm">
            <Link href="/" className="ml-4 sm:ml-6 md:ml-8 lg:ml-10">
                <Image 
                    src="images/heartflow-logo-blue.svg" 
                    alt="Logo" 
                    width={140}
                    height={8}
                    className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] h-auto my-auto"
                    priority
                />
            </Link>
            <div className="flex items-center gap-8 my-auto">
                <Link 
                    href="/admin"
                    className="flex items-center text-[var(--heartflow-blue)] hover:text-[var(--heartflow-blue)]/80 transition-colors duration-300"
                >
                    <FontAwesomeIcon 
                        icon={faLock} 
                        className="w-4 h-4 mr-2 rounded-md p-1 text-[var(--heartflow-blue)]"
                    />
                    Admin Login
                </Link>
                <Link 
                    href="/login"
                    className="px-10 py-3 text-white bg-[var(--heartflow-red)] rounded-3xl hover:bg-[var(--heartflow-red)]/90 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    Login
                </Link>
                
                <Link 
                    href="/signup"
                    className="px-10 py-3 text-white bg-[var(--heartflow-blue)] rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    Signup
                </Link>
            </div>
        </nav>
    )
}

export default Navbar