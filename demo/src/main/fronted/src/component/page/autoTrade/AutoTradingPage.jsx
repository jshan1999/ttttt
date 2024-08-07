import React, { useState, useEffect } from 'react';
import Chart from "../../mainPage/Chart";
import styled from "styled-components";
import axios from "axios";
import {UserContext, useUser} from '../../../UserContext';
import reload from "../../image/reload.png"

const ExeContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    border-top: 1px solid black;
`;

const ButtonContainer = styled.div`
    margin-top: 8px;
    display: flex;
    align-items: center;
`;

const ExecuteButton = styled.button`
    margin-left: 8px;
    background-color: grey;
    color: white;
    border: none;
    padding: 3px 20px;
    cursor: pointer;
`;

const ExitButton = styled.button`
    margin-left:8px;
    background-color: blue;
    color:white;
    padding: 3px 20px;
    cursor: pointer;
`;

const ReloadButton = styled.button`
    margin-left: 8px;
    background-color: white;
    color: black;
    border: 1px solid black;
    padding: 3px 10px; 
    cursor: pointer;
    display: flex;
    align-items: center;

    img {
        width: 20px; 
        height: 20px;
    }
`;


const LogContainer = styled.div`
    width: 95%;
    margin-top: 8px;
    flex-direction: column;
    align-items: center;
    border: 1px solid black;
`;

const LogItemWrapper = styled.div`
    display: flex;
    width: 99%;
    justify-content: space-between;
    padding: 8px;
    border-bottom: 1px solid #ccc;
`;

const LogItem = styled.div`
    flex-basis: 25%;
    text-align: center;
    border-right: 1px solid black;
`;

function AutoTradingPage() {
    const [tradeLogs, setTradeLogs] = useState([]);
    const { username } = useUser();

    // 실행 버튼 클릭 시
    const handleExecute = () => {
        axios.post("http://13.125.228.218:8080/api/livetrades",{
            username: username
        })
            .then(response => {
                // 성공적으로 요청을 보냈을 때 처리할 코드
                console.log("POST 요청 성공:");
            })
            .catch(error => {
                // 요청이 실패했을 때 처리할 코드
                console.error("POST 요청 실패:", error);
            });
    };

    const handleExit = () => {
        axios.post("http://13.125.228.218:8080/api/exit",{
            username: username
        })
            .then(response => {
                console.log("POST 요청 성공:", response.data);
            })
            .catch(error => {
                console.error("POST 요청 실패:", error);
            });
    };

    const reloadButton = () => {
        if (username !== "") {
            axios.post("http://13.125.228.218:8080/api/getdata", {
                username: username
            })
                .then(response => {
                    console.log("GET 요청 성공:", response.data);
                    setTradeLogs(response.data);
                })
                .catch(error => {
                    console.error("GET 요청 실패:", error);
                });
        }
    };

    useEffect(() => {
        if (username !== "") {
            axios.post("http://13.125.228.218:8080/api/getdata", {
                username: username
            })
                .then(response => {
                    console.log("GET 요청 성공:", response.data);
                    setTradeLogs(response.data);
                })
                .catch(error => {
                    console.error("GET 요청 실패:", error);
                });
        }
    }, []);

    return (
        <div>
            <Chart />
            <ExeContainer>
                <ButtonContainer>
                    <ExecuteButton onClick={handleExecute}>실행</ExecuteButton>
                    <ExitButton onClick={handleExit}>종료</ExitButton>
                    <ReloadButton onClick={reloadButton}><img src={reload} alt="새로고침" /></ReloadButton>
                </ButtonContainer>
                <LogContainer>
                    <LogItemWrapper>
                        <LogItem>시간</LogItem>
                        <LogItem>포지션</LogItem>
                        <LogItem>진입 가격</LogItem>
                        <LogItem>청산 가격</LogItem>
                        <LogItem>수익</LogItem>
                    </LogItemWrapper>
                    {Array.isArray(tradeLogs) && tradeLogs.length > 0 ? (
                        tradeLogs.map((trade, index) => (
                            <LogItemWrapper key={index}>
                                <LogItem>{trade.datetime}</LogItem>
                                <LogItem>{trade.position}</LogItem>
                                <LogItem>{trade.entryPrice}</LogItem>
                                <LogItem>{trade.exitPrice}</LogItem>
                                <LogItem>{trade.profit}</LogItem>
                            </LogItemWrapper>
                        ))
                    ) : (
                        <div>No data available</div>
                    )}
                </LogContainer>
            </ExeContainer>
        </div>
    );
}

export default AutoTradingPage;
