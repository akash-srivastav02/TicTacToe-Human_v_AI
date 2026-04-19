import { useState } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [status, setStatus] = useState("Your Turn");
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("hard");

  const [mode, setMode] = useState(3);
  const [round, setRound] = useState(1);
  const [roundResults, setRoundResults] = useState([]);

  const [popup, setPopup] = useState(null);

  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const checkWinner = (b,p)=>
    winPatterns.some(pattern=>pattern.every(i=>b[i]===p));

  const handleClick = (i) => {
    if (board[i] || isGameOver || currentTurn !== "X") return;

    const newBoard = [...board];
    newBoard[i] = "X";

    setBoard(newBoard);
    setCurrentTurn("O");
    setStatus("Computer Thinking...");

    if (checkWinner(newBoard,"X")) return endRound("X");
    if (!newBoard.includes("")) return endRound("draw");

    computerMove(newBoard);
  };

  const computerMove = (b) => {
    const empty = b.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    let move;

    if (difficulty==="easy") {
      move = empty[Math.floor(Math.random()*empty.length)];
    } else if (difficulty==="medium") {
      move = Math.random()<0.5 ? getBestMove(b) : empty[Math.floor(Math.random()*empty.length)];
    } else {
      move = getBestMove(b);
    }

    const newBoard = [...b];
    newBoard[move] = "O";

    setTimeout(()=>{
      setBoard(newBoard);
      setCurrentTurn("X");
      setStatus("Your Turn");

      if (checkWinner(newBoard,"O")) return endRound("O");
      if (!newBoard.includes("")) return endRound("draw");
    },500);
  };

  const endRound = (result) => {
    setRoundResults(prev => [...prev, result]);

    if (round >= mode) {
      setIsGameOver(true);

      if (result === "draw") setPopup("Match Draw!");
      else if (result === "X") setPopup("You Won the Match!");
      else setPopup("AI Won the Match!");

    } else {
      setTimeout(()=>{
        setBoard(Array(9).fill(""));
        setRound(prev=>prev+1);
        setCurrentTurn("X");
        setStatus("Next Round");
      },800);
    }
  };

  const getBestMove = (b) => {
    let bestScore = -Infinity, move;
    b.forEach((cell,i)=>{
      if(cell===""){
        b[i]="O";
        let score=minimax(b,0,false);
        b[i]="";
        if(score>bestScore){bestScore=score;move=i;}
      }
    });
    return move;
  };

  const minimax = (b,d,isMax)=>{
    if(checkWinner(b,"O")) return 10-d;
    if(checkWinner(b,"X")) return d-10;
    if(!b.includes("")) return 0;

    if(isMax){
      let best=-Infinity;
      b.forEach((c,i)=>{
        if(c===""){
          b[i]="O";
          best=Math.max(best,minimax(b,d+1,false));
          b[i]="";
        }
      });
      return best;
    } else {
      let best=Infinity;
      b.forEach((c,i)=>{
        if(c===""){
          b[i]="X";
          best=Math.min(best,minimax(b,d+1,true));
          b[i]="";
        }
      });
      return best;
    }
  };

  const resetMatch = () => {
    setBoard(Array(9).fill(""));
    setRound(1);
    setRoundResults([]);
    setIsGameOver(false);
    setStatus("Your Turn");
    setCurrentTurn("X");
    setPopup(null);
  };

  return (
    <div className="app">

      {/* LEFT */}
      <div className="left">
        <div className="game-box">
          <h1>Tic Tac Toe</h1>
          <h3>{status}</h3>

          <div className="controls">
            <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select value={mode} onChange={(e)=>setMode(Number(e.target.value))}>
              <option value={1}>Once</option>
              <option value={3}>Best of 3</option>
              <option value={5}>Best of 5</option>
            </select>
          </div>

          <div className="board">
            {board.map((cell,i)=>(
              <div key={i} className="cell" onClick={()=>handleClick(i)}>
                {cell}
              </div>
            ))}
          </div>

          <button onClick={resetMatch}>Reset</button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        <div className="table-box">
          <h2>Points Table</h2>

          <table>
            <thead>
              <tr>
                <th>Round</th>
                {[...Array(mode)].map((_,i)=><th key={i}>R{i+1}</th>)}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>You</td>
                {[...Array(mode)].map((_,i)=>(
                  <td key={i}>{roundResults[i]==="X"?"✔️":""}</td>
                ))}
              </tr>

              <tr>
                <td>AI</td>
                {[...Array(mode)].map((_,i)=>(
                  <td key={i}>{roundResults[i]==="O"?"✔️":""}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP */}
      {popup && (
        <div className="popup">
          <div className="popup-box">
            <h2>{popup}</h2>
            <button onClick={resetMatch}>Play Again</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;