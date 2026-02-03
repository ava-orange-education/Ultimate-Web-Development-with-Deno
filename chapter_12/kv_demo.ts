// Open KV
const kv = await Deno.openKv(); // Use path for local persistence if needed: openKv("./kv.db")

// 1. Basic Set/Get
await kv.set(["config", "theme"], "dark");
const entry = await kv.get(["config", "theme"]);
console.log("Theme:", entry.value); // "dark"

// 2. Atomic Transaction (Bank Transfer)
const aliceKey = ["accounts", "alice"];
const bobKey = ["accounts", "bob"];

// Reset balances for demo
await kv.set(aliceKey, 1000);
await kv.set(bobKey, 0);

async function transfer(amount: number) {
    const aliceEntry = await kv.get<number>(aliceKey);
    const bobEntry = await kv.get<number>(bobKey);

    if (!aliceEntry.value || aliceEntry.value < amount) {
        throw new Error("Insufficient funds");
    }

    const newAliceBalance = aliceEntry.value - amount;
    const newBobBalance = (bobEntry.value || 0) + amount;

    const tx = kv.atomic();
    
    // Optimistic Concurrency Control
    tx.check(aliceEntry) // Ensure alice's balance hasn't changed
      .set(aliceKey, newAliceBalance)
      .set(bobKey, newBobBalance);
      
    const result = await tx.commit();
    
    if (!result.ok) {
        throw new Error("Transaction failed due to conflict. Retry.");
    }
    
    console.log(`Transferred ${amount}. New Balances -> Alice: ${newAliceBalance}, Bob: ${newBobBalance}`);
}

await transfer(100);

// 3. Secondary Indexes
interface User {
    id: string;
    email: string;
    name: string;
}

const user: User = { id: "u1", email: "alice@example.com", name: "Alice" };

const op = kv.atomic();
op.set(["users", user.id], user);
op.set(["users_by_email", user.email], user.id);
await op.commit();

// Lookup by email
const emailKey = ["users_by_email", "alice@example.com"];
const idEntry = await kv.get<string>(emailKey);
if (idEntry.value) {
    const userEntry = await kv.get(["users", idEntry.value]);
    console.log("User found by email:", userEntry.value);
}
