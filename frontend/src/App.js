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
	
	//async：途中で待ち時間が発生するという宣言
	const searchBooks = async () => {
		if (!query) return;
		//読み込み中の表示をオン
		setLoading(true);
		try{
			//BookController.javaの@GetMapping("/search"))を叩く
			//await：返事が返ってくるまで一時停止
			const response = await axios.get(`http://localhost:8080/api/books/search?query=${query}`);
			
			//Google Books APIの結果からresponse.data.itemsに入っている値をbooksに保存
			//itemsになにもデータが入っていなければ[]（空の配列）を入れる
			setBooks(response.data.items || []);
		} catch (error){
			console.error("検索に失敗しました", error);
			alert("エラーが発生しました。バックエンドが起動しているか確認してください。");
		} finally{
			setLoading(false);
		}
	};
	
	//本をお気に入りに保存
	const saveBook = async (book) => {
		const bookData = {
			//Googleから届くJSONデータは、1冊につきidとvolumeInfoに分かれ、volumeInfoの中にtitle、authorsなどが入っている
			title: book.volumeInfo.title,
			//?.（オプショナルチェイニング）：~authorsが存在する場合は「,」で配列を繋げる。
			author: book.volumeInfo.authors?.join(', '),
			thumbnailUrl: book.volumeInfo.imageLinks?.thumbnail
		};
		try{
			//axios.postはbookDataをJSON形式のテキストに変換する
			await axios.post('http://localhost:8080/api/books/save', bookData);
			alert('データベースに保存しました！');
			//本が保存されたら、更新して画面に反映
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
	
	//本を削除
	const deleteBook = async (id) => {
		if (!window.confirm("この本をライブラリから削除しますか？")) return;
		await axios.delete(`http://localhost:8080/api/books/${id}`);
		fetchMyLibrary(); //一覧を更新
	}
	
	//メモを削除
	const deleteMemo = async (memoId) => {
		await axios.delete(`http://localhost:8080/api/books/memos/${memoId}`);
		fetchMyLibrary();
	}
	
	return(
		<div style={{
			backgroundColor: '#f8f9fa', minHeight: '10vh',padding: '40px 20px',
			fontFamily: '"Helvativa Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
			color: '#2d3436' 
		}}>
			<h1>読書記録</h1>
			
			{/* 検索フォーム */}
			<div style={{ marginBottom: '20px'}}>
				<input
					type="text"
					value={query}
					//inputタグの(e.target)のvalueをqueryに入れる
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
						<div key={book.id} style={{
							backgroundColor: "#ffffff",
							borderRadius: '16px',
							boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
							padding: '20px',
							position: 'relative',
							transition: 'transform 0.2s',
							border: 'none'
						}}>
							{/* 本の削除ボタン */}
							<button 
								onClick={() => deleteBook(book.id)}
								style={{ 
									position: 'absolute', top: '12px', right: '12px',
									backgroundColor: '#ffeaa7',
									border: 'none', borderRadius: '50px',
									width: '32px', height: '32px',
									cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
								}}
							>削除
							</button>
							<img src={book.thumbnailUrl} alt={book.title} style={{ height: '100px'}} />
							<h3 style={{
								 fontSize: '1.1rem',
								 fontWeight: 'bold',
								 color: '#2d3436',
								 marginBottom: '8px',
								 lineHeight: '1.4'
							 }}>{book.title}</h3>
							 <p style={{ color: '#636e72', fontSize: '0.9rem', margin: '15px'}}>{book.author}</p>

							{/* 保存済みのメモ一覧 */}
							<div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '10px', minHeight: '50px'}}>
								<p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 5px 0'}}>読書メモ:</p>
								{book.memos && book.memos.map((m) => (
									<p key={m.id} style={{ fontSize: '12px', margin: '3px 0', borderBottom: '1px dotted #ccc'}}>
										・{m.content}
										<span
											onClick={() => deleteMemo(m.id)}
											style={{ cursor: 'pointer', color: 'red', fontSize: '12px'}}
										>削除
										</span>
									</p>
								))}
							</div>
							
							{/* メモ入力欄 */}
							<div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box'}}>
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
									style={{
										flex: 1, minWidth: 0, padding: '10px',
										borderRadius: '8px', border: '1px solid #dfe6e9',
										outline: 'none', fontSize: '0.9rem',
										backgroundColor: '#f9f9f9'
									}}
								/>
								<button
									onClick={() => addMemo(book.id)}
									style={{
										backgroundColor: '#6c5ce7',
										color: 'white', border: 'none',
										borderRadius: '8px', padding: '0px 15px', whiteSpace: 'nowrap',
										fontWeight: 'bold', cursor: 'pointer'
										
									}}
								>追加</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default App;