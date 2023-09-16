

export const getRandomString = (num: number) => {
	const arr = ['1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

	const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
	return shuffled.slice(0, num).join('');
}