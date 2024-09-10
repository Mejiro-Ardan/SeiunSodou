const RuntimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // TODO
});