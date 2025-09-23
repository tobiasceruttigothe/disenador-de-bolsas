import logo from '../assets/pack designer final.png';

export default function Header() {
  return (
    <header style={{ backgroundColor: '#016add', padding: '0.5rem' }}>
      <div className="flex items-center">
        <ul>
            <h2 className="text-2xl font-bold text-white ml-4">
            Pack Designer
            </h2>
        </ul>
      </div>
    </header>
  )
}
