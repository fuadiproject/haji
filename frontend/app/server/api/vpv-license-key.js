export default defineEventHandler((event) => {
  const { vpvLicenseKey } = useRuntimeConfig(event);
  return {
    licenseKey: vpvLicenseKey,
  };
});
