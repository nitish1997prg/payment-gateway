export async function retry(
    operation,
    {
        retries = 10,
        initialDelay = 1000,
        maxDelay = 30000,
        backoffFactor = 2,
        jitter = true,
        operationName = "Operation"
    } = {}
) {
    let delay = initialDelay;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === retries) {
                console.error(
                    `${operationName} failed after ${retries} attempts.`
                );
                throw error;
            }

            const jitterDelay = jitter
                ? Math.floor(Math.random() * 500)
                : 0;

            const waitTime = Math.min(delay, maxDelay) + jitterDelay;

            console.warn(
                `${operationName} failed (Attempt ${attempt}/${retries}): ${error.message}`
            );

            console.log(`Retrying in ${waitTime} ms...`);

            await new Promise(resolve => setTimeout(resolve, waitTime));

            delay = Math.min(delay * backoffFactor, maxDelay);
        }
    }
}