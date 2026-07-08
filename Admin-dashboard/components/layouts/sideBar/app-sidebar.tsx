'use client';

import * as React from 'react';
import { Ban, BookImageIcon, Command, Frame, LifeBuoy, Map, PieChart, ScissorsIcon, Send, User2 } from 'lucide-react';

import { NavProjects } from '@/components/layouts/sideBar/nav-projects';
import { NavSecondary } from '@/components/layouts/sideBar/nav-secondary';
import { NavUser } from '@/components/layouts/sideBar/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
const email = 'minhtit006@gmail.com';
const data = {
    user: {
        name: 'admin',

        avatar: '/admin/shadcn.jpg',
    },

    navSecondary: [
        {
            title: 'Hỗ trợ',
            url: `mailto:${email}`,
            icon: LifeBuoy,
        },
        {
            title: 'Phản hồi',
            url: `mailto:${email}`,
            icon: Send,
        },
    ],
    projects: [
        {
            name: 'Thống kê',
            url: 'dashboard',
            icon: PieChart,
        },
        {
            name: 'Khách hàng ',
            url: 'customers',
            icon: User2,
        },
        {
            name: 'Khách hàng bị cấm ',
            url: 'customerBanneds',
            icon: Ban,
        },
        {
            name: 'Nhà tạo mẫu',
            url: 'stylist',
            icon: ScissorsIcon,
        },
        {
            name: 'Dịch vụ ',
            url: 'service',
            icon: Map,
        },
        {
            name: 'Combo ',
            url: 'combo',
            icon: Command,
        },
        {
            name: 'Lịch hẹn ',
            url: 'booking',
            icon: BookImageIcon,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Hệ Thống Quản Lý </span>
                                    <span className="truncate text-xs">v2.0.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* <NavMain items={data.navMain} /> */}
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
