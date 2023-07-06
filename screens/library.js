import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, Image, TouchableOpacity, TouchableHighlightComponent } from 'react-native';
import color from '../contains/color';
import fontStyle from '../contains/fontStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import db, { collection, getDocs, doc, deleteDoc, where, query } from '../firebase';


const Library = () => {
    const [savedVocabularies, setSavedVocabularies] = useState([]);
    const user = useSelector(state => state.user)
    const [userID, setUserID] = useState('');
    useEffect(() => {
        //console.log(user.id);
        getUserID();
        getSavedVocabularies();
    }, [savedVocabularies])
    const getUserID = async () => {
        const querySnapshot = await getDocs(collection(db, "USER"));
        querySnapshot.forEach((doc) => {
            if (doc.data().id === user.id) {
                setUserID(doc.id);
                // console.log(doc.id);
            }
        });
        // console.log(userID);
    };
    const getSavedVocabularies = async () => {
        try {
            const usersCollectionRef = collection(db, 'USER');
            const q = query(usersCollectionRef, where('id', '==', user.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const myVocabularyCollectionRef = collection(userDoc.ref, 'MY_VOCABULARY');
                const vocabularyQuerySnapshot = await getDocs(myVocabularyCollectionRef);

                const savedVocabularies = vocabularyQuerySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setSavedVocabularies(savedVocabularies);
            } else {
                console.log('Không tìm thấy người dùng.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách từ vựng:', error);
        }
    };
    const deleteVocabulary = async (userId, vocabularyId) => {
        console.log(vocabularyId);
        try {
            const userDocRef = doc(db, 'USER', userId);
            const vocabularyDocRef = doc(userDocRef, 'MY_VOCABULARY', vocabularyId);

            await deleteDoc(vocabularyDocRef);
            console.log('Từ vựng đã được xóa thành công!');
            // Xóa từ vựng khỏi mảng savedVocabularies
            const updatedVocabularies = savedVocabularies.filter((vocabulary) => vocabulary.id !== vocabularyId);
            console.log(updatedVocabularies);
            setSavedVocabularies(updatedVocabularies);
        } catch (error) {
            console.error('Lỗi khi xóa từ vựng:', error);
        }
    };
    return (
        <SafeAreaView style={styles.main}>
            <Header />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.containerWordGroup}>
                        <Text style={styles.txtwordGroup}>Từ vựng đã lưu</Text>
                    </View>

                    <View>
                        {
                            savedVocabularies.map((item, index) => (

                                <View style={styles.wrapwords} key={index}>
                                    <Text style={styles.txtWord}>{item.word}</Text>
                                    <TouchableOpacity style={styles.wrapbtn}
                                        onPress={() => deleteVocabulary(userID, item.id)}>
                                        <Text style={styles.txtbtn}>Xóa từ vựng</Text>
                                    </TouchableOpacity>
                                </View>

                            ))
                        }
                    </View>

                    <View style={styles.containerWordGroup}>
                        <Text style={styles.txtwordGroup}>Tin tức đã lưu</Text>
                    </View>
                    <View style={styles.wrapItem}>
                        <Image style={styles.img} source={require('../sources/images/toppic.png')} />
                        <View style={styles.detailContainer}>
                            <Text style={styles.txtname}>Tên tin tức</Text>
                            <TouchableOpacity style={styles.wrapbtn}>
                                <Text style={styles.txtbtn}>Xóa tin tức</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.containerWordGroup}>
                        <Text style={styles.txtwordGroup}>Video đã lưu</Text>
                    </View>
                    <View style={styles.wrapItem}>
                        <Image style={styles.img} source={require('../sources/images/toppic.png')} />
                        <View style={styles.detailContainer}>
                            <Text style={styles.txtname}>Tên video</Text>
                            <TouchableOpacity style={styles.wrapbtn}>
                                <Text style={styles.txtbtn}>Xóa video</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#f6f6f6',
        height: '100%',
        paddingBottom: 80,
    },
    scrollContainer: {
        marginTop: 1,
    },
    container: {
        flex: 1,
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
        fontFamily: fontStyle.fontfamily_2,
        fontSize: 20,
        marginLeft: 80,
        color: color.txt5,
    },
    containerWordGroup: {
        width: 330,
        alignItems: 'flex-start',
    },
    txtwordGroup: {
        fontSize: 20,
        fontFamily: fontStyle.fontfamily_2,
        fontWeight: 'bold',
        color: color.txt4,
        marginTop: 30,
        marginBottom: 20,
    },
    wrapwords: {
        flexDirection: 'row',
        width: 346,
        height: 70,
        backgroundColor: color.btn_color3,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        // elevation: 3,
        marginBottom: 5,
    },
    txtWord: {
        fontSize: 20,
        fontFamily: fontStyle.fontfamily_1,
        fontWeight: 600,
        color: color.txt1,
        marginLeft: 20,
    },
    wrapbtn: {
        width: 114,
        height: 31,
        borderRadius: 20,
        backgroundColor: color.btn_color4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
    },
    txtbtn: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: fontStyle.fontfamily_2,
        color: color.txtbtn_color1,
    },
    wrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 346,
        height: 145,
        borderRadius: 20,
        backgroundColor: color.btn_color3,
        alignItems: 'center',
        //justifyContent: 'center',
    },
    img: {
        width: 150,
        height: 98,
        borderRadius: 20,
    },
    detailContainer: {
        width: 130,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        //backgroundColor: color.btn_color2,
    },
    txtname: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: fontStyle.fontfamily_1,
        color: color.txt1,
        marginBottom: 10,
    },
});

export default Library;
