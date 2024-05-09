import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.fakar",
  appName: "Fakar",
  webDir: "public",
  server: {
    androidScheme: "https",
  },
};

export default config;
