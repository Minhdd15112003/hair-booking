'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';

interface LoadingDialogProps {
    isOpen: boolean;
    title: string;
}

export function LoadingAction({ isOpen, title }: LoadingDialogProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <Dialog open={isOpen} onOpenChange={() => { }}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg">
                    <div className="flex flex-col items-center justify-center space-y-4 py-6">
                        <h2 className="text-lg font-semibold text-center">{title}</h2>
                        <div className="loader">
                            <div className="bar bar1"></div>    
                            <div className="bar bar2"></div>
                            <div className="bar bar3"></div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
