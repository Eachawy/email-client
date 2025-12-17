async function sendEmail(form, apiBaseUrl) {
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    const res = await fetch(`${apiBaseUrl}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
}

// Expose a small global API for your HTML to call
export function wireUp(formSelector, apiBaseUrl, statusSelector) {
    const form = document.querySelector(formSelector);
    const status = document.querySelector(statusSelector);

    if (!form) throw new Error("Form not found");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (status) status.textContent = "Sending...";

        try {
            await sendEmail(form, apiBaseUrl);
            if (status) status.textContent = "Sent ✅";
            form.reset();
        } catch (err) {
            if (status) status.textContent = `Failed: ${err.message}`;
        }
    });
}
