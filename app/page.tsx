export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(255, 217, 61, 0.2), rgba(74, 144, 200, 0.1), rgba(255, 170, 165, 0.2))',
        padding: '4rem 1.5rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #FFD93D, #FFAAA5, #4A90C8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            光·來了
          </h1>
          <p style={{
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: '500',
            marginBottom: '1rem',
            color: '#333',
          }}>
            玩出喜樂、美善的品格
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: '1.8',
            marginBottom: '2rem',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto 2rem',
            padding: '0 1rem',
          }}>
            這裡是專屬童樂的園地，結合萌趣的遊戲及活潑活用的體驗和手作，使在「光·來了」的每個孩童，玩出喜樂、美善的品格。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '2rem' }}>
            <a
              href="#register"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                fontWeight: '600',
                color: 'white',
                background: '#4A90C8',
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '200px',
                textAlign: 'center',
              }}
            >
              🎉 預約免費體驗
            </a>
            <a
              href="#courses"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                fontWeight: '600',
                color: '#4A90C8',
                background: 'white',
                border: '2px solid #4A90C8',
                borderRadius: '9999px',
                textDecoration: 'none',
                minWidth: '200px',
                textAlign: 'center',
              }}
            >
              📚 了解課程
            </a>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ background: 'white', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#333',
          }}>
            💡 我們的核心價值
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#666',
          }}>
            在「光·來了」，孩子不只是學習，更是在愛中成長
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {/* Value Card 1 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 217, 61, 0.1), rgba(255, 170, 165, 0.1))',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎨</div>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#333',
              }}>
                品格培養
              </h3>
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                lineHeight: '1.7',
                color: '#666',
              }}>
                透過聖經故事與生活實踐，培養誠實、勇氣、愛心、分享等美好品格，讓孩子成為有光的人。
              </p>
            </div>

            {/* Value Card 2 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(74, 144, 200, 0.1), rgba(180, 231, 206, 0.1))',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎵</div>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#333',
              }}>
                技能發展
              </h3>
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                lineHeight: '1.7',
                color: '#666',
              }}>
                音樂律動、手作創意、科學實驗，在體驗中探索自我，發現上帝賜予的獨特恩賜。
              </p>
            </div>

            {/* Value Card 3 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 170, 165, 0.1), rgba(74, 144, 200, 0.1))',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>❤️</div>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#333',
              }}>
                愛的陪伴
              </h3>
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                lineHeight: '1.7',
                color: '#666',
              }}>
                專業師資與志工團隊，用愛心與耐心陪伴每個孩子，讓他們在安全、溫暖的環境中快樂成長。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" style={{ background: '#FFF8E7', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#333',
          }}>
            📚 分齡課程
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#666',
          }}>
            根據孩子的年齡與發展階段，設計最適合的課程內容
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {/* Course 1 */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFD93D, #FFAAA5)',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🐣</div>
                <h3 style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '0.25rem',
                }}>
                  幼幼班
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>2-6 歲</p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  lineHeight: '1.7',
                  marginBottom: '1rem',
                  color: '#666',
                }}>
                  透過遊戲、唱遊和簡單手作，認識上帝的愛，建立基本品格概念。
                </p>
                <ul style={{ fontSize: '0.875rem', color: '#666', paddingLeft: '0', listStyle: 'none' }}>
                  <li style={{ marginBottom: '0.5rem' }}>✓ 聖經故事時間</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ 音樂律動</li>
                  <li>✓ 創意手作</li>
                </ul>
              </div>
            </div>

            {/* Course 2 */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #4A90C8, #B4E7CE)',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌱</div>
                <h3 style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '0.25rem',
                }}>
                  撒母耳班
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>7-9 歲</p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  lineHeight: '1.7',
                  marginBottom: '1rem',
                  color: '#666',
                }}>
                  深入聖經真理，培養獨立思考與團隊合作能力，在實踐中成長。
                </p>
                <ul style={{ fontSize: '0.875rem', color: '#666', paddingLeft: '0', listStyle: 'none' }}>
                  <li style={{ marginBottom: '0.5rem' }}>✓ 品格主題探索</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ 團隊遊戲</li>
                  <li>✓ 科學實驗</li>
                </ul>
              </div>
            </div>

            {/* Course 3 */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFAAA5, #4A90C8)',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌟</div>
                <h3 style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '0.25rem',
                }}>
                  約書亞班
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>10-12 歲</p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  lineHeight: '1.7',
                  marginBottom: '1rem',
                  color: '#666',
                }}>
                  建立信仰根基，培養領導力與服務精神，成為有影響力的光。
                </p>
                <ul style={{ fontSize: '0.875rem', color: '#666', paddingLeft: '0', listStyle: 'none' }}>
                  <li style={{ marginBottom: '0.5rem' }}>✓ 聖經深度學習</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ 服務實踐</li>
                  <li>✓ 領導力培訓</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="register" style={{
        background: 'linear-gradient(135deg, #4A90C8, #2E5C8A)',
        padding: '4rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem',
          }}>
            ✨ 讓孩子體驗光的美好
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '2rem',
          }}>
            歡迎預約免費體驗課程，親身感受「光·來了」的溫暖與喜樂！
          </p>
          <a
            href="/register"
            style={{
              display: 'inline-block',
              padding: '1.25rem 2.5rem',
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
              fontWeight: 'bold',
              color: '#333',
              background: '#FFD93D',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            }}
          >
            🎉 立即預約體驗
          </a>
          <div style={{ marginTop: '2rem', color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
            <p style={{ marginBottom: '0.5rem' }}>⏰ 每週日 10:00-11:30</p>
            <p>📍 台中市大里區東榮路312號</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#333', color: 'white', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}>
            <div>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: 'bold',
                color: '#FFD93D',
                marginBottom: '1rem',
              }}>
                光·來了
              </h3>
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                lineHeight: '1.7',
                color: 'rgba(255,255,255,0.8)',
              }}>
                大里思恩堂兒童主日學<br />
                讓孩子在愛中成長，玩出喜樂、美善的品格
              </p>
            </div>
            <div>
              <h4 style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                fontWeight: '600',
                marginBottom: '1rem',
              }}>
                聯絡資訊
              </h4>
              <div style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '2',
              }}>
                <p>📍 412台灣大里區東榮路312號</p>
                <p>📞 04 2482 3735</p>
                <p>⏰ 每週日 10:00-11:30</p>
              </div>
            </div>
            <div>
              <h4 style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                fontWeight: '600',
                marginBottom: '1rem',
              }}>
                快速連結
              </h4>
              <div style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                lineHeight: '2',
              }}>
                <p><a href="#courses" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>課程介紹</a></p>
                <p><a href="/gallery" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>活動花絮</a></p>
                <p><a href="/register" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>預約體驗</a></p>
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '2rem',
            textAlign: 'center',
            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
            color: 'rgba(255,255,255,0.6)',
          }}>
            <p>© 2025 光·來了 - 大里思恩堂兒童主日學. Made with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
