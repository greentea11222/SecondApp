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
	
	const saveBook = async (book) => {
		const bookData = {
			title: book.volumeInfo.title,
			author: book.volumeInfo.authors?.join(', '),
			thumbnailUrl: book.volumeInfo.imageLinks?.thumbnail
		};
		
		try{
			await axios.post('http://localhost:8080/api/books/save', bookData);
			alert('データベースに保存しました！');
		}catch (error){
			console.error("保存に失敗しました", error);
		}
	};
	
	return(
		<div style={{ padding: '20px', fontFamily: 'sans-serif'}}>
			<h1>読書記録</h1>
			
			{/* 検索フォーム */}
			<div style={{ marginBottom: '20px'}}>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="本のタイトルを入力"
					style={{ padding: '8px', width: '250px'}}
				/>
				<button onClick={searchBooks} style={{ padding: '8px 16px', marginLeft: '8px'}}>
				検索
				</button>
			</div>
			
			{loading && <p>読み込み中</p>}
			
			{/* 検索結果の表示 */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
				{books.map((book) => (
					<div key={book.id} style={{ border: '1px solid #ccc', borderRadius: '8px'}}>
						{/* 画像がある場合のみ表示 */}
						{book.volumeInfo.imageLinks?.thumnail && (
							<img src={book.volumeInfo.imageLinks.thumnail} alt={book.volumeInfo.title} style={{ width: '100%'}} />
						)}
						<h3 style={{ fontSize: '16px'}}>{book.volumeInfo.title}</h3>
						<p style={{ fontSize: '14px', color: '#666'}}>{book.volumeInfo.authors?.join(', ')}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;