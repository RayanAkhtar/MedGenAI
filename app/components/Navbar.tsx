'use client'
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

library.add(faLock)

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm">
            <Link href="/" className="ml-2 sm:ml-2 md:ml-2 lg:ml-2">
                <Image 
                    src="/images/cod_logo_full.png" 
                    alt="Logo" 
                    width={200}
                    height={8}
                    className=""
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