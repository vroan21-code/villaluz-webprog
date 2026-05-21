const dns = require('dns');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Windows: Node's SRV lookup can fail with querySrv ECONNREFUSED; public DNS fixes it.
        dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

        const conn = await mongoose.connect(process.env.MONGO_URI, {});
        console.log(`MongoDB Connected: ${conn.connection.host} (database: ${conn.connection.name})`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;