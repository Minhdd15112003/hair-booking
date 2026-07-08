import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

import { ExpoNotiService } from '../expo-noti/expo-noti.service';
import { VnpayModule } from 'nestjs-vnpay';

@Module({
    imports: [
        VnpayModule,
        VnpayModule.register({
            tmnCode: 'L7ODOMNQ',
            secureSecret: 'U9FPOHV7YZEF78V43PH8ZBCE8GEWO6D0',
            vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true

        }),
        ExpoNotiService,
    ],
    controllers: [PaymentController],
    providers: [PaymentService, ExpoNotiService],
    exports: [PaymentService],
})
export class PaymentModule {}
