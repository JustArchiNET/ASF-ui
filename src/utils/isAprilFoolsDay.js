export default function isAprilFoolsDay() {
  const now = new Date();
  return (now.getMonth() === 3 && now.getDate() === 1);
}
