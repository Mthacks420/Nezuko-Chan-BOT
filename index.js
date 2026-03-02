const { spawn } = require("child_process");
const log = require("./logger/log.js");
const fs = require("fs-extra");

// --- AppState Load Korar Logic (Trishar Special) ---
if (process.env.APPSTATE) {
    try {
        // Render jekhane appstate.dev.txt khuje, amra thik shei namei file banchhi
        fs.writeFileSync("./account.dev.txt", process.env.APPSTATE);
        log.info("✅ AppState successfully created from Render Secret!");
    } catch (err) {
        log.error("❌ Failed to create AppState file: " + err);
    }
}
// --- Logic Shesh ---

function startProject() {
    // Akhane Hinata.js bad diye Nezuko.js call kora holo
    const child = spawn("node", ["Nezuko.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (code) => {
        if (code == 2) {
            log.info("Restarting Project...");
            startProject();
        }
    });
}

startProject();
