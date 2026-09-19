import express from 'express';
import { fileURLToPath } from 'url';

const router = express.Router();

/**
 * Handles incoming booking webhooks from AgriFlow.
 * Expects JSON body with:
 * - farmerName
 * - phone
 * - cropType
 * - quantityQuintals
 * - mandiLocation
 * - slot
 */
const handleBooking = (req, res) => {
  const {
    farmerName,
    phone,
    cropType,
    quantityQuintals,
    mandiLocation,
    slot,
  } = req.body || {};

  // Log the received farmer data to the console
  console.log('--- [AgriFlow Webhook] New Booking Received ---');
  console.log({
    farmerName,
    phone,
    cropType,
    quantityQuintals,
    mandiLocation,
    slot,
    receivedAt: new Date().toISOString(),
  });

  // Return status 200 JSON success response
  return res.status(200).json({
    success: true,
    message: 'Booking received',
  });
};

// Handle POST requests at /api/webhook/booking (and /booking if mounted under /api/webhook)
router.post('/api/webhook/booking', handleBooking);
router.post('/booking', handleBooking);

export { router };
export default router;

// Standalone Express app setup (allows running this file directly)
const app = express();
app.use(express.json());
app.use(router);

// Start server automatically when run directly via: node src/api/webhook.js
const isDirectExecution =
  process.argv[1] &&
  fileURLToPath(import.meta.url).toLowerCase() === process.argv[1].toLowerCase();

if (isDirectExecution) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`AgriFlow Webhook Server listening on http://localhost:${PORT}`);
    console.log(`POST Endpoint: http://localhost:${PORT}/api/webhook/booking`);
  });
}
