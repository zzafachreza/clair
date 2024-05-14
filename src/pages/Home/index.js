import { Alert, StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Dimensions, ImageBackground, TouchableWithoutFeedback, TouchableNativeFeedback, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { MyDimensi, colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { NavigationRouteContext, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/en';
import moment from 'moment';
import 'moment/locale/id';
import MyCarouser from '../../components/MyCarouser';
import { Rating } from 'react-native-ratings';
import { MyGap, MyHeader } from '../../components';
import GetLocation from 'react-native-get-location';
import ProgressCircle from 'react-native-progress-circle'
export default function Home({ navigation, route }) {



  const [user, setUser] = useState({});
  const isFocus = useIsFocused();
  const [data, setData] = useState([{ "halaman": "AsupanMpasi", "id": "1", "image": "https://simonev.okeadmin.com/datafoto/a0003ce4349b2c7d4eff29b6d51a37075a774c47.png", "judul": "Asupan  MPASI", "warna": "#FE9A3B33" }, { "halaman": "AsupanAsi", "id": "2", "image": "https://simonev.okeadmin.com/datafoto/4f8b42e79f74f6c6d5a45865b9d5d9ca20a2a33e.png", "judul": "Asupan ASI", "warna": "#FF96A533" }, { "halaman": "StatusGizi", "id": "3", "image": "https://simonev.okeadmin.com/datafoto/43f86c8c8d15892eb4fbbd6466051168022d3918.png", "judul": "Status Gizi", "warna": "#FFA72633" }, { "halaman": "TanyaJawab", "id": "4", "image": "https://simonev.okeadmin.com/datafoto/abf1442b27cc406e0320e251e6ac57ba62d2128a.png", "judul": "Tanya Jawab", "warna": "#FFE29433" }, { "halaman": "Artikel", "id": "5", "image": "https://simonev.okeadmin.com/datafoto/655b4e3a81f3c760a001b1199ccb38aa6c1e63c4.png", "judul": "Artikel", "warna": "#CCE0F133" }, { "halaman": "Video", "id": "6", "image": "https://simonev.okeadmin.com/datafoto/9c25ee17076411e53acbefd97c3a40240642013a.png", "judul": "Video", "warna": "#C92B7433" }, { "halaman": "Resep", "id": "7", "image": "https://simonev.okeadmin.com/datafoto/30eea7e269ad623a515074c7b6ef65680b2bed84.png", "judul": "Resep MPASI", "warna": "#FFCDBC33" }, { "halaman": "Faq", "id": "8", "image": "https://simonev.okeadmin.com/datafoto/87a8a923f8334cde6a8fab507ea83964a76248d1.png", "judul": "FAQ", "warna": "#9CC44533" }, { "halaman": "GameKuis", "id": "9", "image": "https://simonev.okeadmin.com/datafoto/98b60a5ebe438acf92a114070e89ed0a52d11754.png", "judul": "Game Kuis", "warna": "#56D8D833" }]);
  const [open, setOpen] = useState(false);
  const [comp, setComp] = useState({});
  const [loading, setLoading] = useState(true);
  const IMAGE = [
    {
      label: 'Bagus',
      image: require('../../assets/1.png')
    },
    {
      label: 'Sedang',
      image: require('../../assets/2.png')
    },
    {
      label: 'Tidak sehat untuk kelompok sensitif',
      image: require('../../assets/3.png')
    },
    {
      label: 'Tidak sehat',
      image: require('../../assets/4.png')
    },
    {
      label: 'Sangat tidak sehat',
      image: require('../../assets/5.png')
    },
    {
      label: 'Berbahaya',
      image: require('../../assets/6.png')
    },
  ]

  const [aqi, setAqi] = useState({
    "city": "Bandung", "country": "Indonesia", "current": {
      "pollution": {
        "aqicn": 38, "aqius": 82, "maincn": "p2", "mainus": "p2", "ts":
          "2024-03-21T00:00:00.000Z"
      }, "weather": {
        "hu": 91, "ic": "01d", "pr":
          1012, "tp": 20, "ts": "2024-03-20T23:00:00.000Z", "wd": 184, "ws": 0.89
      }
    }, "location": { "coordinates": [107.60694, -6.92222], "type": "Point" }, "state": "West Java"
  })

  const [artikel, setArtikel] = useState([]);
  const [nomor, setNomor] = useState(0)

  const _getTransaction = async () => {


    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        console.log(location);
        storeData('lokasi', {
          lat: location.latitude,
          long: location.longitude
        })
        setLokasi({
          lat: location.latitude,
          long: location.longitude
        });

        axios.get(`https://api.airvisual.com/v2/nearest_city?lat=${location.latitude}&lon=${location.longitude}&key=4de3c5dd-7eaf-4a75-8d87-7b99f0a4ca29`)
          .then(res => {
            console.log(res.data.data)
            setAqi(res.data.data);
            storeData('aqi', res.data.data);
          })

      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      }).finally(() => {
        setLoading(false)
      })

    getData('user').then(u => {
      setUser(u);
    })

    axios.post(apiURL + 'company').then(res => {

      setComp(res.data.data);

    });

    axios.post(apiURL + 'artikel').then(res => {
      console.log(res.data)
      setArtikel(res.data);

    });


  }


  useEffect(() => {
    if (isFocus) {
      _getTransaction();
    }
  }, [isFocus]);

  const [lokasi, setLokasi] = useState({
    lat: 0,
    long: 0
  })



  const __renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate(item.modul, item)}>
        <View style={{
          flex: 1,
          padding: 10,
          borderWidth: 1,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: colors.secondary,
          // backgroundColor: colors.white,
          margin: 5,
          height: windowHeight / 8,
        }}>

          <Image source={{
            uri: item.image
          }} style={{
            // flex: 1,
            width: 40,
            height: 40,
            resizeMode: 'contain'
          }} />
          <Text style={{
            marginTop: 10,
            fontFamily: fonts.secondary[600],
            fontSize: 8,
            color: colors.secondary,
            textAlign: 'center'
          }}>{item.judul}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }


  return (

    <View style={{
      flex: 1,
      width: "100%",
      height: "100%",

      backgroundColor: colors.primary,



    }}>

      {/* HEADERS */}
      <View style={{
        flexDirection: "row",
        backgroundColor: "white",
        padding: 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        justifyContent: 'space-between'


      }}>

        <View>
          <Text style={{
            fontFamily: fonts.primary[800]

          }}>Hello {user.nama_lengkap}</Text>
          <Text style={{ fontFamily: fonts.primary[400] }}>
            Mau tau kualitas udara hari ini ?
          </Text>
        </View>


        <Image source={require('../../assets/logo2.png')} style={{
          width: 50, height: 50,
        }}
        />


      </View>

      <ScrollView>
        {/* MAIN CONTRNT */}
        <View style={{ padding: 10, }}>

          {/*DETEKSI KONDISI CUACA HARI INI  */}
          <View>

            <Text style={{
              fontFamily: fonts.primary[600],
              color: 'white',
              fontSize: MyDimensi / 4

            }}>Outdoor Conditions
            </Text>
            <View style={{ padding: 1, backgroundColor: colors.white, marginTop: 10 }}></View>



            {/* CARD */}
            {!loading && <View style={{
              padding: 10,
              backgroundColor: colors.white,
              borderRadius: 10,
              marginTop: 10

            }}>
              {/* MASUKAN LOKASI TEMPAT DISINI */}


              <View style={{ flexDirection: 'row', }}>
                <Image source={require('../../assets/kordinat.png')} style={{
                  height: 21, width: 21,
                }} />
                <Text style={{ fontFamily: fonts.primary[600], left: 10 }}>{`${aqi.city}, ${aqi.state}, ${aqi.country}`}</Text>
              </View>






              {aqi.current.pollution.aqius > 0 && aqi.current.pollution.aqius <= 50 &&
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: MyDimensi / 2.5
                  }}>{IMAGE[0].label}</Text>
                  <Image source={IMAGE[0].image} style={{
                    width: '70%',
                    resizeMode: 'contain'
                  }} />
                </View>
              }
              {aqi.current.pollution.aqius > 50 && aqi.current.pollution.aqius <= 100 &&
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: MyDimensi / 2.5
                  }}>{IMAGE[1].label}</Text>
                  <Image source={IMAGE[1].image} style={{
                    width: '70%',
                    resizeMode: 'contain'
                  }} />
                </View>
              }

              {aqi.current.pollution.aqius > 100 && aqi.current.pollution.aqius <= 150 &&
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: MyDimensi / 2.5
                  }}>{IMAGE[2].label}</Text>
                  <Image source={IMAGE[2].image} style={{
                    width: '70%',
                    resizeMode: 'contain'
                  }} />
                </View>
              }

              {aqi.current.pollution.aqius > 150 && aqi.current.pollution.aqius <= 200 &&
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: MyDimensi / 2.5
                  }}>{IMAGE[3].label}</Text>
                  <Image source={IMAGE[3].image} style={{
                    width: '70%',
                    resizeMode: 'contain'
                  }} />
                </View>
              }

              {aqi.current.pollution.aqius > 200 && aqi.current.pollution.aqius <= 300 &&
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: MyDimensi / 2.5
                  }}>{IMAGE[4].label}</Text>
                  <Image source={IMAGE[4].image} style={{
                    width: '70%',
                    resizeMode: 'contain'
                  }} />
                </View>
              }

              {aqi.current.pollution.aqius > 300 &&
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: MyDimensi / 2.5
                  }}>{IMAGE[5].label}</Text>
                  <Image source={IMAGE[5].image} style={{
                    width: '70%',
                    resizeMode: 'contain'
                  }} />
                </View>
              }
              <View style={{ flexDirection: "row", justifyContent: 'center' }}>

                {/* <Text style={{ fontFamily: fonts.primary[400], fontSize: MyDimensi / 6.9, color: "gray" }}>
                  Beberapa orang mungkin sensitif{'\n'}20 rb mengikuti
                </Text> */}

                <View style={{ left: 0, flexDirection: "row" }}>
                  <ProgressCircle
                    percent={100}
                    radius={40}
                    borderWidth={8}
                    color={colors.primary}
                    shadowColor="#999"
                    bgColor="#fff"
                  >
                    <Text style={{ fontSize: 20, textAlign: 'center', fontFamily: fonts.secondary[800] }}>{aqi.current.pollution.aqius}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center', fontFamily: fonts.secondary[400] }}>AQI</Text>
                  </ProgressCircle>
                  <View style={{
                    marginHorizontal: 10,
                  }} />
                  <ProgressCircle
                    percent={100}
                    radius={40}
                    borderWidth={8}
                    color={colors.secondary}
                    shadowColor="#999"
                    bgColor="#fff"
                  >
                    <Text style={{ fontSize: 20, textAlign: 'center', fontFamily: fonts.secondary[800] }}>{aqi.current.pollution.aqicn}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center', fontFamily: fonts.secondary[400] }}>{'PM2.5'}</Text>
                  </ProgressCircle>
                </View>

              </View>
            </View>}


          </View>

          {/* MENU 1 INSIGHT*/}

          <Text style={{ fontFamily: fonts.primary[600], fontSize: MyDimensi / 3.5, textAlign: 'center', color: 'white', marginTop: 20 }}>INSIGHT</Text>
          <View style={{ padding: 1, backgroundColor: colors.white, marginTop: 10 }}></View>

          <FlatList data={artikel} numColumns={2} renderItem={({ item }) => {
            return (
              <TouchableNativeFeedback onPress={() => {
                navigation.navigate('ArtikelDetail', item)
              }}>
                <View style={{
                  flex: 1,
                  margin: 10,
                }}>
                  <Image source={{
                    uri: item.image
                  }} style={{
                    width: '100%',
                    height: 120,
                    borderRadius: 10,
                  }} />
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    color: colors.white
                  }}>{item.judul}</Text>
                </View>
              </TouchableNativeFeedback>
            )
          }} />






        </View>

        <MyGap jarak={50} />
      </ScrollView>



    </View>

  )
}

const styles = StyleSheet.create({
  tulisan: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: fonts.secondary[600],
    color: colors.black,
    textAlign: 'justify'
  },
  tulisanJudul: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: fonts.secondary[800],
    color: colors.black,
    textAlign: 'justify'
  }
})