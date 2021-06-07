import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button } from 'native-base';
import { Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [items, setItems] = useState([]);
  const [readyMediaLibrary, setReadyMediaLibrary] = useState(false);
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    (async () => {
      (async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setReadyMediaLibrary(status === 'granted');
      })();
    })();
    (async () => {
      try {
        const response = await axios.get('http://203.250.55.204:8080/product');
        setItems(response.data);
      } catch (err) {
        alert(err);
      }
    })();
  });
  const pickImage = async () => {
    if (!readyMediaLibrary) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.cancelled) {
      setImage(result);
    }
  };
  const uploadImage = async () => {
    try{
      const filename = image.uri.split('/').pop();
      const indexOfDot = filename.lastIndexOf('.');
      const ext = filename.substring(indexOfDot+1);
      const formData = new FormData();
      formData.append('myfile', {
        uri:image.uri,
        name:filename,
        type: `image/${ext}`
      });
      const res = await axios.post('http://203.250.55.204:8080/upload', formData); //업로드한 사진의 정보
      setResponse(res);
    }catch(err){
      setResponse(err);
    }
  }

  return (
    <Container>
      <Header></Header>
      <Content>
        <Button onPress={pickImage}>
          <Text>SELECT IMAGE</Text>
        </Button>
        {image && <Image source={{ uri: image.uri }} style={{ width: '100%', height: 200 }} />}
        {image && <Text>{JSON.stringify(image)}</Text>}
        {image && <Button onPress={uploadImage}>
          <Text>UPLOAD</Text>
        </Button>}
        {response && <Text>{JSON.stringify(response)}</Text>}
        {items && items.length == 0 && <Text>NO DATA</Text>}
        {items && items.map((item, index) => (
          <Card key={index}>
            <CardItem>
              <Image source={{ uri: item.image }} style={{ width: '100%', height: 200 }} />
            </CardItem>
            <CardItem>
              <Text>{item.name}</Text>
            </CardItem>
          </Card>
        ))}
      </Content>
    </Container>
  );
}
