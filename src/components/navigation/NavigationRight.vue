<template>
    <div class="flex flex-1 gap-4 p-4 md:p-6">
        <div class="flex flex-col gap-4 w-[300px]">
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden" data-v0-t="card">
                <div class="space-y-1.5 flex flex-col items-center gap-2 bg-muted/50 p-4">
                    <span class="relative flex shrink-0 overflow-hidden rounded-full h-16 w-16">
                        <img class="aspect-square h-full w-full" src="https://api-space.tnxg.top/avatar?s=qq" />
                    </span>
                    <div class="grid gap-0.5 text-center">
                        <div class="font-semibold">Username</div>
                        <div class="text-sm text-muted-foreground">miku@example.com</div>
                    </div>
                </div>
                <div class="p-4">
                    <div class="grid gap-3">
                        <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">Orders</span>
                            <span class="font-medium">12</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">Subscriptions</span>
                            <span class="font-medium">3</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">Referrals</span>
                            <span class="font-medium">25</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-1">
            <div class="rounded-lg border bg-card w-full">
                <slot />
            </div>
        </div>
    </div>
</template>