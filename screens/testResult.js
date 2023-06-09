import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import color from '../contains/color';
import fontstyle from '../contains/fontStyle';
import fontStyle from '../contains/fontStyle';
import moment from 'moment';
import db, { collection, query, where, getDocs, orderBy, doc, addDoc } from '../firebase/index'
import { useIsFocused } from '@react-navigation/native';
const { width, height } = Dimensions.get('window')

const TestResult = (props) => {
    const { navigation, route } = props
    const { listQuestion, listAnswer, listChosse, idTest } = route.params
    const isFocusedScreen = useIsFocused();
    const [listInco, setListInco] = useState([])
    const [numInSuc, setNumInSuc] = useState(0)
    const [level, setLevel] = useState('C2');
    const [advice, setAdvice] = useState('');

    useEffect(() => {
        if (isFocusedScreen) {
            getResult()
        } else {
            setNumInSuc(0)
            setListInco([])
        }
    }, [isFocusedScreen])

    const getResult = () => {
        setListInco([])
        let numInSucces = 0;
        const listResultInco = []
        listQuestion.forEach((question, i) => {
            const itemAn = listAnswer.find((ans) => { return ans.id == question.id && ans.isTrue == true })
            if (listChosse[i] != itemAn.idA) {
                numInSucces += 1
                const valueincorrect = listAnswer.find((ans) => { return ans.idA == listChosse[i] })
                listResultInco.push({ incorrectId: listChosse[i], answer: itemAn.answer, index: i, incorrect: valueincorrect.answer, ...question })
            }
        });
        setNumInSuc(numInSucces)
        setListInco(listResultInco)

        switch (true) {
            case numInSucces >= 0 && numInSucces <= 2:
                setLevel('C2');
                setAdvice(`bạn đạt được ${(20 - numInSucces) / 2}, chúc mừng bạn đã có trình độ C2. Tiếp tục học tập và luyện tập để nâng cao trình độ của mình.`);
                break;
            case numInSucces >= 3 && numInSucces <= 5:
                setLevel('C1');
                setAdvice(`bạn đạt được ${(20 - numInSucces) / 2} điểm, bạn có trình độ C1. Đây là một kết quả tốt, tuy nhiên, bạn cần tiếp tục học tập và luyện tập để có thể đạt được trình độ cao hơn.`);
                break;
            case numInSucces >= 6 && numInSucces <= 7:
                setLevel('B2');
                setAdvice(`bạn đạt được ${(20 - numInSucces) / 2} điểm, bạn có trình độ B2. Đây là một trình độ khá tốt, tuy nhiên, bạn cần tiếp tục phát triển kỹ năng ngôn ngữ của mình.`);
                break;
            case numInSucces >= 8 && numInSucces <= 9:
                setLevel('B1');
                setAdvice(`bạn đạt được ${(20 - numInSucces) / 2} điểm, bạn có trình độ B1. Đây là một kết quả trung bình, bạn cần phải tập trung hơn vào các kỹ năng ngôn ngữ còn yếu để nâng cao trình độ của mình.`);
                break;
            case numInSucces >= 10 && numInSucces <= 12:
                setLevel('A2');
                setAdvice(`bạn đạt được ${(20 - numInSucces) / 2} điểm, bạn có trình độ A2. Đây là một kết quả thấp, bạn cần phải tập trung hơn vào việc học tập và luyện tập các kỹ năng ngôn ngữ cơ bản.`);
                break;
            default:
                setLevel('A1');
                setAdvice(`bạn đạt được ${(20 - numInSucces) / 2} điểm, bạn có trình độ A1. Đây là một kết quả rất thấp, bạn cần phải bắt đầu học tập từ những kiến thức cơ bản nhất và luyện tập thường xuyên để cải thiện trình độ của mình.`);
                break;
        }

    }
    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>
            <View style={styles.container}>
                {/* <View style={styles.headcontainer}>
                    <Image style={styles.imgreturn} source={require('../sources/icons/arrowleft.png')} />
                    <Text style={styles.txthead}>Kiểm tra trình độ</Text>
                </View> */}
                <Text style={styles.txtResult}>Kết quả kiểm tra</Text>
                {/* Số câu đúng */}
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30 }}>
                    <View style={styles.wrapItem}>
                        <Image style={styles.img} source={require('../sources/images/check.png')} />
                        <Text style={styles.txtItem}> {20 - numInSuc}/20</Text>
                    </View>
                    <View style={styles.wrapItem}>
                        <Image style={styles.img} source={require('../sources/images/wrong.png')} />
                        <Text style={styles.txtItem}>{numInSuc}/20</Text>
                    </View>
                </View>
                <View style={styles.wrapEvaluate}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.txtEvaluateNow}>Trình độ hiện tại của bạn là </Text>
                        <Text style={[styles.txtEvaluateNow, { fontWeight: 'bold' }]}> {level}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginHorizontal: 20,
                            marginTop: 15,
                        }}
                    >
                        <Text style={[styles.txtEvaluateNow, { fontWeight: 'bold' }]}>Lời khuyên: </Text>

                        <Text style={styles.txtEvaluateNow}>
                            {advice}
                        </Text>
                    </View>
                </View>
                <View style={{ width: '100%', paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.btnRetest}>
                        <Text style={styles.txtbtnRetest}>Xem lại bài làm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.btnRetest, borderColor: color.btn_color4, backgroundColor: '#fff' }}>
                        <Text style={{ ...styles.txtbtnRetest, color: color.btn_color4 }} onPress={() => navigation.navigate("Home")}>Về trang chủ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',

    },
    headcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.btn_color3,
        height: 80,
        width: 390,
    },
    imgreturn: {
        width: 30,
        height: 30,
        marginLeft: 38,
    },
    txthead: {
        fontFamily: fontstyle.fontfamily_2,
        fontSize: 20,
        marginLeft: 60,
        color: color.txt5,
    },
    txtResult: {
        marginLeft: 30,
        fontSize: 22,
        fontFamily: fontStyle.fontfamily_2,
        fontWeight: 400,
        color: 'black',
        alignSelf: 'flex-start'
    },
    wrapItem: {
        width: 136,
        height: 136,
        marginTop: 40,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 13,
        backgroundColor: '#ffff',
        elevation: 8,
    },
    img: {
        width: '35%',
        height: '35%',
        marginTop: 5
    },
    txtItem: {
        marginTop: 10,
        fontSize: 22,
        fontFamily: fontStyle.fontfamily_2,
        color: 'black',
    },
    wrapEvaluate: {
        marginHorizontal: 30,
        marginTop: 30,
        marginBottom: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#ffffff",
        paddingVertical: 20,
        elevation: 8,
    },
    txtEvaluateNow: {
        fontSize: 20,
        fontWeight: 300,
        fontFamily: fontStyle.fontfamily_2,
        color: 'black',
        paddingLeft: 10,
    },
    btnRetest: {
        marginTop: 33,
        paddingHorizontal: 20,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: color.btn_color4,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    txtbtnRetest: {
        fontSize: 18,
        fontWeight: 500,
        fontFamily: fontStyle.fontfamily_2,
        color: color.txtbtn_color1,
    },
});
export default TestResult;