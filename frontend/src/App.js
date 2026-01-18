import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App(){
	const [query, setQuery] = useState('');
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [myBooks, setMyBooks] = useState([]);
	const [memoTexts, setMemoTexts] = useState({});
	
	//DBから保存済みの本を読み込む
	const fetchMyLibrary = async () => {
		const response = await axios.get('http://localhost:8080/api/books/my-library');
		setMyBooks(response.data);
	};
	
	//初回のみ実行
	useEffect(() => {
		fetchMyLibrary();
	}, []);
	
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
			fetchMyLibrary();
		}catch (error){
			console.error("保存に失敗しました", error);
		}
	};
	
	const addMemo = async (bookId) => {
		const content = memoTexts[bookId];
		if(!content) return;
		await axios.post(`http://localhost:8080/api/books/${bookId}/memos`, { content});
		setMemoTexts({ ...memoTexts, [bookId]: ''});
		fetchMyLibrary();
		alert("メモを保存しました！");	
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
						{book.volumeInfo.imageLinks?.thumbnail && (
							<img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} style={{ width: '100%'}} />
						)}
						<h3 style={{ fontSize: '16px'}}>{book.volumeInfo.title}</h3>
						<p style={{ fontSize: '14px', color: '#666'}}>{book.volumeInfo.authors?.join(', ')}</p>
						
						<button
							onClick={() => saveBook(book)}
							style={{ marginTop: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}
						>
							お気に入り追加
						</button>
					</div>
				))}
			</div>
			<hr style={{ margin: '40px 0'}} />
			<h2>マイライブラリ</h2>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
				{myBooks.map((book) => {
					return(
						<div key={book.id} style={{ border: '2px solid #007bff', padding: '15px', borderRadius: '10px', backgroundColor: '#f0f7ff'}}>
							<img src={book.thumbnailUrl} alt={book.title} style={{ height: '100px'}} />
							<h3 style={{ fontSize: '16px'}}>{book.title}</h3>
							<p style={{ fontSize: '12px'}}>{book.author}</p>
							{/**追加 */}
							<h3>{book.title}(ID: {book.id})</h3>
							{/* 保存済みのメモ一覧 */}
							<div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '10px', minHeight: '50px'}}>
								<p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 5px 0'}}>読書メモ:</p>
								{book.memos && book.memos.map((m) => (
									<p key={m.id} style={{ fontSize: '12px', margin: '3px 0', borderBottom: '1px dotted #ccc'}}>
										・{m.content}
									</p>
								))}
							</div>
							
							{/* メモ入力欄 */}
							<div style={{ display: 'flex', gap: '5px'}}>
								<input
									type="text"
									value={memoTexts[book.id] || ''}
									onChange={(e) => {
										const newValue = e.target.value;	
										setMemoTexts(prev => ({
											...prev, [book.id]: newValue
										}));
									}}
									placeholder="感想を入力..."	
									style={{ flex: 1, padding: '5px'}}
								/>
								<button onClick={() => addMemo(book.id)} style={{ padding: '5px'}}>追加</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default App;