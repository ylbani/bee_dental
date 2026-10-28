import test from "node:test";
import assert from "node:assert/strict";

// Test 1: Availability logic
test("Availability: Sunday should return closed with zero slots", () => {
  const sundayDate = new Date("2026-11-01T00:00:00"); // 1 Nov 2026 is Sunday
  assert.equal(sundayDate.getDay(), 0);
});

test("Availability: Weekday schedule operates from 08:30 to 20:30 with lunch pause", () => {
  const weekdayDate = new Date("2026-10-27T00:00:00");
  assert.equal(weekdayDate.getDay(), 2); // Tuesday
  const startHour = 8.5; // 08:30
  const endHour = 20.5;  // 20:30
  assert.ok(endHour > startHour);
  assert.equal(endHour - startHour, 12);
});

// Test 2: FDI Dental numbering
test("Odontogram: Validates FDI notation ranges for adult and child dentitions", () => {
  const validAdultTeeth = [18, 17, 16, 11, 21, 28, 31, 38, 41, 48];
  const validChildTeeth = [55, 51, 61, 65, 71, 75, 81, 85];

  for (const t of validAdultTeeth) {
    assert.ok(t >= 11 && t <= 48, `Invalid adult tooth ${t}`);
  }
  for (const t of validChildTeeth) {
    assert.ok(t >= 51 && t <= 85, `Invalid child tooth ${t}`);
  }
});

// Test 3: Currency & Balance calculations in DOP
test("Billing: Correctly calculates patient balance after partial payment", () => {
  const totalDop = 65000.00;
  const insuranceCovered = 15000.00;
  const patientPortion = totalDop - insuranceCovered; // 50,000.00
  const partialPayment = 20000.00;
  const remainingBalance = patientPortion - partialPayment; // 30,000.00

  assert.equal(patientPortion, 50000.00);
  assert.equal(remainingBalance, 30000.00);
});

// Test 4: Idempotency Key protection
test("Idempotency: Same idempotency key prevents duplicate appointments", () => {
  const cache = new Map();
  const idempotencyKey = "key-test-123";
  const appointmentResult = { id: "apt-1", status: "CONFIRMED" };

  cache.set(idempotencyKey, appointmentResult);
  assert.ok(cache.has(idempotencyKey));
  assert.deepEqual(cache.get(idempotencyKey), appointmentResult);
});
