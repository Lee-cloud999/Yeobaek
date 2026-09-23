# 여백 PWA v5 — 동기화/백업

추가 기능
- Google 로그인
- Firestore 동기화
- 최초 로그인 시 기존 localStorage 기록과 클라우드 기록 병합
- 설정 > 지금 동기화
- JSON 전체 백업
- JSON 백업 복원(기존 기록과 병합)
- 로그인하지 않은 상태에서도 기존 로컬 저장 유지
- v5 서비스워커 캐시

Firebase 보안 규칙은 users/{userId}/... 에서 request.auth.uid == userId 인 경우만 읽기/쓰기를 허용하는 구성을 전제로 합니다.

GitHub 저장소 루트의 기존 파일들을 이 압축 파일의 파일들로 교체하세요.
