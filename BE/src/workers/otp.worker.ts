import * as cron from 'node-cron';
import { PrismaDB } from 'src/modules/prisma/prisma.extensions';

export default cron.schedule('*/1 * * * *', async () => {
    try {
        const result = await PrismaDB.otp.deleteMany({
            where: {
                expiresAt: {
                    lte: new Date(),
                },
            },
        });
        result.count > 0 && console.log(`${result.count} OTP(s) deleted`);
    } catch (error) {
        console.error('Error deleting expired OTPs:', error);
    }
});
