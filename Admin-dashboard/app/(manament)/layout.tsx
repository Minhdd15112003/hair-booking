'use client';

import { AppSidebar } from '@/components/layouts/sideBar/app-sidebar';
import { DynamicBreadcrumb } from '@/components/layouts/sideBar/dynamicBreadcrumb';

import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import SocketClient from '@/lib/socket';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socketClient = SocketClient.getInstance();
const socket = socketClient.getSocket();

socket.on('notification', (e) => {
    const options: any = {
        position: 'top-right',
        autoClose: e.type === 'default' ? 10000 : false,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Flip,
        onClick: () => {
            if (e.url) {
                window.location.replace(e.url);
            }
        },
    };
    switch (e.type) {
        case 'success':
            toast.success(e.msg, options);
            break;
        case 'error':
            toast.error(e.msg, options);
            break;
        case 'warning':
            toast.warning(e.msg, options);
            break;
        case 'info':
            toast.info(e.msg, options);
            break;
        default:
            toast(e.msg, options);
    }
});

export default function Layout({ children }: { children: React.ReactNode }) {
    // try {
    //     const admin_id = localStorage.getItem('admin_id');

    //     if (admin_id) {
    //         socketClient.registerUser(admin_id);
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <DynamicBreadcrumb />
                    </div>
                </header>
                <main className="p-16 toast-mware">
                    <ToastContainer />
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
