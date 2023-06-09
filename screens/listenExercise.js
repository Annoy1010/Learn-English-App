import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import color from '../contains/color';
import fontstyle from '../contains/fontStyle';
import db, { getDocs, collection } from '../firebase/index';
import { useIsFocused } from '@react-navigation/native';

import Loading from '../components/Loading'

const ListenExercise = ({ navigation, route }) => {
    const isFocusedScreen = useIsFocused();
    const [levels, setLevels] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const handleGetEnglishLevels = async () => {
        const querySnapshot = await getDocs(collection(db, "LEVEL_ENG"));
        let eng_levels = []
        querySnapshot.forEach((doc) => {
            if (eng_levels.length < 6) {
                eng_levels.push({
                    id: doc.id,
                    ...doc.data()
                })
            }
        });
        setLevels(eng_levels);
    }

    useEffect(() => {
        if (isFocusedScreen) {
            handleGetEnglishLevels()
        } else {
            setLevels([]);
            setLoaded(false);
        }
    }, [isFocusedScreen])

    useEffect(() => {
        if (!loaded && levels.length > 0) {
            const extraLevels = [...levels];
            extraLevels.sort((a, b) => (a.name > b.name) ? 1 : -1)
            setLevels(extraLevels);
            setLoaded(true);
        }
    }, [levels])

    return (
        <React.Fragment>
            {
                loaded ? (
                    <View style={styles.container}>
                        <View style={styles.headcontainer}>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    left: 30,
                                    height: '100%',
                                    justifyContent: 'center',
                                }}
                                onPress={() => navigation.navigate("Exercise")}
                            >
                                <Icon name='arrow-left' size={20} color={color.txt5} />
                            </TouchableOpacity>
                            <Text style={styles.txthead}>Bài tập nghe</Text>
                        </View>
                        <View>
                            <Text style={{
                                marginTop: 10,
                                marginLeft: 25,
                                fontSize: 18
                            }}>Chọn cấp độ nghe</Text>
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                {
                                    levels.length > 0 && levels.map((level, index) => (
                                        <TouchableOpacity key={index} style={styles.levelItem} onPress={() => navigation.navigate("ListenExerciseTopic", {
                                            level_id: level.id,
                                            level_name: level.name
                                        })}>
                                            <Text style={{
                                                fontSize: 24,
                                                fontWeight: 'bold'
                                            }}>{level.name}</Text>
                                        </TouchableOpacity>
                                    )
                                    )
                                }
                            </View>
                        </View>
                    </View>
                ) : (
                    <Loading />
                )
            }
        </React.Fragment>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#ffff'
    },
    headcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        textAlign: 'center',
        color: color.txt5,
    },
    levelItem: {
        width: '35%',
        height: '32%',
        marginHorizontal: 25,
        marginVertical: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        elevation: 5
    }
})

export default ListenExercise;