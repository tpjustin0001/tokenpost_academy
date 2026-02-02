'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
    isOpen: boolean
    toggle: () => void
    close: () => void
    open: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    // 초기값은 닫혀있거나(모바일) 열려있음(데스크탑) - 여기서는 데스크탑 기준 true로 시작하되
    // useEffect에서 화면 크기 체크 가능. 일단 true로 시작.
    const [isOpen, setIsOpen] = useState(true)

    const toggle = () => setIsOpen(prev => !prev)
    const close = () => setIsOpen(false)
    const open = () => setIsOpen(true)

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}
