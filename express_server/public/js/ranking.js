async function loadRanking(){
    const res = await fetch('/ranking');
	const result = await res.json();
    const rankingBoard = document.querySelector('#ranking-board');
    const ranking = result["result"];
 
    let rank = 0;
    for ( let i of ranking){
        rank += 1;
        rankingBoard.innerHTML += `
            <tr>
            <th scope="row">${rank}</th>
            <td id="username">${i.username}</td>
            <td id="score">${i.score}</td>
            </tr>
        `
    }
        
}

// Window onload function
window.addEventListener('load', async () => {
	loadRanking();
});