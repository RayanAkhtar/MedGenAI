'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faTrophy, faStar, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

interface GameTypeModalProps {
    isOpen: boolean
    closeModal: () => void
}

const GameTypeModal = ({ isOpen, closeModal }: GameTypeModalProps) => {
    const router = useRouter()

    const gameTypes = [
        {
            name: 'Classic',
            description: 'Practice at your own pace',
            icon: faGamepad,
            color: 'bg-blue-500',
            route: '/game/classic'
        },
        {
            name: 'Competitive',
            description: 'Compete against others',
            icon: faTrophy,
            color: 'bg-[var(--heartflow-red)]',
            route: '/game/competitive'
        },
        {
            name: 'Special',
            description: 'Limited time challenges',
            icon: faStar,
            color: 'bg-purple-500',
            route: '/game/special'
        },
    ]

    const handleGameSelect = (route: string) => {
        closeModal()
        router.push(route)
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                >
                                    Select Game Type
                                </Dialog.Title>

                                <div className="mt-4 space-y-4">
                                    {gameTypes.map((type) => (
                                        <button
                                            key={type.name}
                                            className="w-full p-4 flex items-center justify-between rounded-xl border border-gray-200 hover:border-[var(--heartflow-blue)] hover:shadow-md transition-all duration-200"
                                            onClick={() => handleGameSelect(type.route)}
                                        >
                                            <div className="flex items-center">
                                                <div className={`${type.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                                    <FontAwesomeIcon icon={type.icon} className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="ml-4 text-left">
                                                    <h4 className="text-base font-medium text-gray-900">{type.name}</h4>
                                                    <p className="text-sm text-gray-500">{type.description}</p>
                                                </div>
                                            </div>
                                            <FontAwesomeIcon 
                                                icon={faChevronRight} 
                                                className="w-4 h-4 text-gray-400" 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default GameTypeModal