import React, {useState} from 'react';
import axios from 'axios';

function App(){
	const [query, setQuery] = useState('');
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(false);
	
	const searchBooks = async () => {
		if (!query) return;
		setLoading(true);
		try{
			//BookController.javaの@GetMapping("/search"))を叩く
			const response = await axios.get(`http://localhost:8080/api/books/search?query=${query}`);
			
			//Google Books APIの結果からitemsという配列を取り出す
			//response.data.itemsに入っている
			setBooks(response.data.items || []);
		} catch (error){
			console.error("検索に失敗しました", error);
			alert("エラーが発生しました。バックエンドが起動しているか確認してください。");
		} finally{
			setLoading(false);
		}
	};
	
	return(
		
	);
}

export dafault App;