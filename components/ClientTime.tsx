"use client";
export default function clientTime() {
  return [new Date().toLocaleDateString("en-IN"), new Date().getHours() + 0];
}
