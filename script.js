const valueChains = [
  {
    id: "strategy",
    title: "전략·제도·연계",
    focus: "수요창출, 제도개선, 금융지원, 협력체계",
    budget: 0,
    summary: "직접 예산사업 외에도 AI반도체 확산을 위해 함께 추진되는 제도·연계 과제를 묶은 영역입니다.",
    projects: [
      createProject({
        id: "k-npu-alliance",
        name: "K-NPU 얼라이언스 및 성능지표 고도화",
        budget: 0,
        target: "수요·공급기업, 시험인증기관",
        stage: "전략·연계",
        source: "2026년 NIPA 통합 사업설명회 발표자료, AI반도체지원본부 추진사업 업무보고",
        description: "민관 협력과 성능지표 고도화를 통해 국산 NPU 생태계의 연결성과 시장 신뢰를 높이는 운영 과제입니다.",
        overview: [
          "수요기업, 공급기업, 시험인증기관이 함께 참여하는 협력체계를 운영해 국산 NPU 생태계의 연결성을 높이는 과제입니다.",
          "정책 공유와 현장 애로 해소, 신규 수요 발굴, 성능지표 고도화를 함께 추진하는 허브 성격의 과제입니다."
        ],
        targetContent: [
          "국내 AI반도체 기업, AI서비스 기업, 수요기관, 공인시험인증기관",
          "정책 협의와 성능 검증 체계에 참여할 산학연 주체"
        ],
        scale: [
          "정책협의, 성능지표 개발, 협의체 운영 중심"
        ],
        support: [
          "K-NPU 얼라이언스 운영과 분과 협의를 통해 수요-공급기업 간 협력 의제 발굴",
          "공인시험인증기관과 연계한 K-Perf 성능지표 개발 및 고도화",
          "정책협의, 현장 애로 발굴, 사업 연계 수요 발굴 등 생태계 소통 기능 수행"
        ],
        schedule: [
          "연중 협의체 운영",
          "사업 연계 수요 발굴 및 제도개선 과제 상시 반영"
        ],
        effect: [
          "생태계 참여자 간 협업 강화",
          "국산 NPU 성능평가의 신뢰도 제고",
          "후속 실증·조달·시장진입 연계 기반 확보"
        ]
      }),
      createProject({
        id: "public-procurement",
        name: "공공조달·금융지원 연계",
        budget: 0,
        target: "AI반도체 기업, 수요기관",
        stage: "제도개선",
        source: "2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "공공조달 혁신과 특화 금융지원을 통해 국산 AI반도체 기업의 성장 기반을 보강하는 연계 과제입니다.",
        overview: [
          "AI반도체 기업이 겪는 자금조달과 공공조달 진입의 어려움을 완화하기 위한 제도 연계 과제입니다.",
          "국민성장펀드, 금융사 연계 융자, 공공조달 항목 신설 등 성장기반 마련에 초점을 둡니다."
        ],
        targetContent: [
          "설계·양산 자금이 필요한 AI반도체 기업",
          "공공조달 등록과 수요기관 납품을 추진하는 기업"
        ],
        scale: [
          "펀드·융자·조달 제도 연계 중심"
        ],
        support: [
          "국민성장펀드, KIF, 금융사 연계 등 직·간접 투자와 융자 방식 검토",
          "계약 및 IP 평가 담보형 초저금리 융자 등 NPU 특화 금융지원 체계 연계",
          "공공조달 내 NPU 품목 신설과 혁신제품 지정, 수요기관 조달 연계 지원"
        ],
        schedule: [
          "연중 제도협의",
          "금융지원 및 조달 개선방안 단계적 추진"
        ],
        effect: [
          "기업의 자금 접근성 개선",
          "공공수요 창출 기반 확대",
          "실증 성과의 조달·시장 확산 연결 강화"
        ]
      })
    ]
  },
  {
    id: "design",
    title: "설계·제작·검증",
    focus: "설계SW, 제품 제작, 검증체계, 최적화 설계",
    budget: 46000,
    summary: "설계부터 제작, 검증과 최적화 설계까지 국산 AI반도체의 상용화 준비 단계를 묶은 영역입니다.",
    projects: [
      createProject({
        id: "timely-support",
        name: "AI반도체 사업화 적시 지원",
        budget: 30000,
        target: "국내 AI반도체 기업 및 스타트업",
        stage: "설계·제작·검증",
        source: "2026년 예산 및 기금운용계획 사업설명자료, 2026년 NIPA 통합 사업설명회 발표자료",
        description: "AI반도체 사업화를 적시에 지원해 유망 기업의 신속한 시장 진출을 촉진하는 사업입니다.",
        overview: [
          "국내 AI반도체 기업과 스타트업이 제품을 빠르게 시장에 내놓을 수 있도록 설계, 제작, 검증 전 단계를 묶어 지원하는 사업입니다.",
          "고비용 설계SW, 시제품 제작, 양산품 고도화, 검증체계 활용을 한 번에 지원해 사업화 병목 구간을 줄이는 데 초점을 둡니다."
        ],
        targetContent: [
          "국내 AI반도체 기업 및 스타트업",
          "설계SW, 시제품 제작, 검증지원을 필요로 하는 기업"
        ],
        scale: [
          "2026년 예산: 30,000백만원",
          "설계SW 15건 내외",
          "제품제작 13건 내외",
          "검증체계 2개 운용"
        ],
        support: [
          "설계SW: 고비용 AI반도체 설계SW를 바우처 형태로 지원하고 전문 엔지니어 컨설팅 제공",
          "제품제작: 초기 설계 검증용 MPW 제작비용 지원과 서버(PCIe) 보드 제작, SW 개발·최적화 지원",
          "양산고도화: 양산품 수준의 기능 구현을 위한 칩·보드 고도화와 후속 사업화 지원",
          "검증지원: 기 구축 검증체계 고도화, 안정성·신뢰성 검증, 설계검증장비 활용 지원"
        ],
        schedule: [
          "2~3월 사업공고",
          "4월 선정평가 및 협약",
          "4~12월 과제수행",
          "8월 중간점검",
          "12월 결과평가"
        ],
        effect: [
          "유망 기업의 신속한 시장 진출 촉진",
          "제품 완성도와 신뢰성 제고",
          "초기 사업화 부담 완화"
        ]
      }),
      createProject({
        id: "design-optimization",
        name: "AI반도체 최적화 설계지원",
        budget: 16000,
        target: "중·소 AI반도체 기업",
        stage: "최적화 설계",
        source: "2026년 예산 및 기금운용계획 사업설명자료, 2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "국산 NPU가 다양한 AI모델에 최적화될 수 있도록 설계지원과 설계 IP 활용을 지원하는 사업입니다.",
        overview: [
          "국산 NPU가 다양한 AI모델과 서비스 환경에서 안정적으로 동작할 수 있도록 맞춤형 설계를 지원하는 사업입니다.",
          "설계에 필요한 IP 활용까지 함께 지원해 중소 AI반도체 기업의 개발 부담을 줄이고 성능 최적화를 돕습니다."
        ],
        targetContent: [
          "AI모델 맞춤형 최적화가 필요한 중소 팹리스 기업",
          "설계 IP 활용과 검증이 필요한 AI반도체 기업"
        ],
        scale: [
          "2026년 반영 규모: 16,000백만원",
          "총 20개 과제",
          "AI모델 맞춤형 설계지원 10개",
          "설계 IP 활용 지원 10개"
        ],
        support: [
          "AI모델별 연산 특성에 맞춘 맞춤형 설계 최적화 지원",
          "CPU, 인터페이스, 메모리 컨트롤러 등 설계 IP 활용과 기술 컨설팅 지원",
          "파운드리 공정별 검증체계 마련과 개방형 IP 활성화 기반 조성",
          "향후 K-IP 공동활용지원 체계와 연계 가능한 선행 기반 확보"
        ],
        schedule: [
          "연중 과제 선정 및 지원",
          "후속 신규기획과 연계 검토"
        ],
        effect: [
          "국산 NPU의 AI모델 호환성과 범용성 확대",
          "설계 단계 경쟁력 강화",
          "중소기업의 고비용 설계 부담 완화"
        ]
      })
    ]
  },
  {
    id: "infrastructure",
    title: "인프라·실증기반",
    focus: "AI컴퓨팅 실증 인프라 고도화",
    budget: 16000,
    summary: "대규모 AI서비스 실증을 위해 국산 NPU 기반 인프라를 구축하고 고도화하는 영역입니다.",
    projects: [
      createProject({
        id: "infra-upgrade",
        name: "AI컴퓨팅 실증 인프라 고도화",
        budget: 16000,
        target: "AI반도체 기업, 데이터센터 보유기업 컨소시엄",
        stage: "실증 인프라",
        source: "2026년 예산 및 기금운용계획 사업설명자료, 2026년 NIPA 통합 사업설명회 발표자료, 2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "AI데이터센터 및 주요 수요분야와 연계한 국산 AI반도체 실증 기반을 확장하는 사업입니다.",
        overview: [
          "대규모 AI서비스를 실제 환경에서 검증할 수 있도록 국산 NPU 기반 실증 인프라를 구축하고 고도화하는 사업입니다.",
          "LLM과 이기종 AI반도체 혼용 서비스 등 대형 AI 상용서비스를 감당할 수 있는 인프라를 목표로 합니다."
        ],
        targetContent: [
          "국내 AI반도체 기업",
          "데이터센터 보유기업 등으로 구성된 컨소시엄"
        ],
        scale: [
          "2026년 예산: 16,000백만원",
          "총 1개 과제, 3년 계속사업",
          "`25년 50PF → `26년 110PF → `27년 155PF(누적)"
        ],
        support: [
          "국산 NPU 기반 AI 실증 인프라를 단계적으로 확충하고 운영단위를 모듈에서 클러스터 수준으로 고도화",
          "LLM, 이기종 AI반도체 혼용서비스 등 대규모 AI 상용서비스 실증에 맞춘 인프라 환경 제공",
          "구축한 인프라를 기반으로 최신 AI서비스 실증 4건 지원",
          "최신 AI서비스 정상구동 검증과 성능 개선을 위한 테스트 환경 제공"
        ],
        schedule: [
          "2월 2차년도 협약체결",
          "3~12월 과제수행",
          "8월 중간점검",
          "12월 연차평가"
        ],
        effect: [
          "국산 AI반도체의 대규모 실증 기반 확보",
          "상용화 레퍼런스 축적",
          "후속 응용실증·AX 확산 사업의 기반 강화"
        ]
      })
    ]
  },
  {
    id: "validation",
    title: "수요발굴·실증·확산",
    focus: "응용실증, 조기상용화, AX 디바이스, AX 실증",
    budget: 110870,
    summary: "서비스 실증과 레퍼런스 확보, AX 디바이스 확산까지 실제 도입과 상용화에 가까운 단계입니다.",
    projects: [
      createProject({
        id: "application-poc",
        name: "AI반도체 응용실증지원",
        budget: 4685,
        target: "AI반도체 기업, 서비스·제품 개발 기업, 연구소, 대학",
        stage: "응용실증",
        source: "2026년 예산 및 기금운용계획 사업설명자료, 2026년 NIPA 통합 사업설명회 발표자료, 2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "국산 AI반도체에 다양한 AI서비스를 적용해 기능·성능 테스트와 레퍼런스 확보를 지원하는 사업입니다.",
        overview: [
          "국산 AI반도체에 다양한 AI서비스를 적용해 실제 활용 가능성과 성능을 검증하는 사업입니다.",
          "서버용과 엣지용 반도체를 중심으로 기능·성능 테스트를 수행하고 도입 가능한 레퍼런스를 확보하도록 지원합니다."
        ],
        targetContent: [
          "국내 AI반도체 기업",
          "AI 서비스·제품 개발 기업, 연구소, 대학 등"
        ],
        scale: [
          "2026년 예산: 4,685백만원",
          "총 5개 과제",
          "과제당 최대 9.4억원 내외"
        ],
        support: [
          "국산 AI반도체 기반 AI 응용실증 환경을 구축하고 보드·서버·엣지 환경 개선 지원",
          "다양한 응용서비스 적용과 기능·성능 점검을 통해 우수사례 확보",
          "실증환경 자체검증과 국가공인시험인증기관 연계 제3자 검증 지원",
          "수요기업이 실제 도입을 검토할 수 있도록 바우처 및 실증 연계 지원"
        ],
        schedule: [
          "2월 2차년도 협약체결",
          "2~12월 과제수행",
          "8월 중간점검",
          "12월 결과평가"
        ],
        effect: [
          "시장 진출용 레퍼런스 확보",
          "실증 신뢰도 제고",
          "후속 조기상용화 사업과의 연계 강화"
        ]
      }),
      createProject({
        id: "early-commercialization",
        name: "국산AI반도체 조기상용화 지원",
        budget: 24370,
        target: "AI반도체 기업, 서비스 기업",
        stage: "조기상용화",
        source: "2026년 예산 및 기금운용계획 사업설명자료, 2026년 NIPA 통합 사업설명회 발표자료",
        description: "기존 소규모·기술검증 중심 실증을 넘어 대규모 실증과 수요창출 중심으로 확장한 조기상용화 사업입니다.",
        overview: [
          "소규모 기술 검증을 넘어 실제 시장 수요와 연계된 대규모 실증을 추진해 국산 AI반도체의 조기 상용화를 지원하는 사업입니다.",
          "성능 검증에 그치지 않고 초기 수요시장 형성과 도입 확산까지 이어질 수 있도록 지원 범위를 넓힌 것이 특징입니다."
        ],
        targetContent: [
          "국내 AI반도체 기업",
          "AI 서비스 기업 및 실증 수요처"
        ],
        scale: [
          "2026년 묶음 예산: 24,370백만원",
          "대규모 실증 및 수요창출 중심 운영",
          "세부 산출은 하위 사업과 연계"
        ],
        support: [
          "AI데이터센터, 온디바이스 AI 등 주요 수요분야와 연계한 대규모 실증 지원",
          "기존 기술검증 중심 실증을 넘어 수요창출과 조기 상용화 중심으로 사업 구조 확대",
          "AI컴퓨팅 실증 인프라 고도화와 사업화 적시 지원, AX 디바이스 실증을 연결하는 허브 기능 수행",
          "실증 결과를 바탕으로 시장진입과 제품화로 이어질 수 있는 연계 지원"
        ],
        schedule: [
          "연중 수요 연계형 실증 추진",
          "하위 세부사업과 연동 운영"
        ],
        effect: [
          "조기 상용화 촉진",
          "수요 창출 마중물 제공",
          "실증에서 시장진입까지 이어지는 전환 가속"
        ]
      }),
      createProject({
        id: "ax-device",
        name: "국산 AI반도체 기반 AX디바이스 개발·실증",
        budget: 22685,
        target: "AI반도체 기업, AI서비스 기업 컨소시엄",
        stage: "AX 디바이스",
        source: "2026년 NIPA 통합 사업설명회 발표자료, 2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "국산 AI반도체를 적용한 AX 디바이스 개발과 상품화 사례 확보를 지원하는 사업입니다.",
        overview: [
          "이미 시장에서 활용 중이거나 산업 수요가 분명한 AI 디바이스를 국산 AI반도체 기반으로 개발·전환해 확산하는 사업입니다.",
          "정규트랙과 미니트랙으로 나뉘어 운영되며, 응용실증 성과를 실제 제품화와 확산으로 연결하는 성격이 강합니다."
        ],
        targetContent: [
          "AI반도체 기업과 AI서비스 기업 등으로 구성된 컨소시엄",
          "산업 수요 기반 AX 디바이스 개발 주체"
        ],
        scale: [
          "2026년 예산: 22,685백만원",
          "총 14개 과제",
          "계속과제 6개, 신규과제 3개, 미니트랙 5개"
        ],
        support: [
          "정규트랙: 청소로봇, 양계관리로봇, 스마트헬멧, 스마트글라스 등 산업수요형 AX 디바이스 개발 지원",
          "정규트랙: 제조·HW + NPU + AI서비스 기업 컨소시엄 기반 2년형 개발·실증 지원",
          "미니트랙: 응용실증된 AI서비스의 검증 결과를 활용한 상품화 사례 확보 지원",
          "기존 6개 과제 외 신규 컨소시엄 추가 지원으로 AX 디바이스 확산 규모 확대"
        ],
        schedule: [
          "2~3월 사업공고",
          "4월 선정평가 및 협약",
          "4~12월 과제수행",
          "8월 중간점검",
          "12월 결과평가"
        ],
        effect: [
          "산업 수요형 제품 사례 확대",
          "국산 NPU 기반 디바이스 생태계 확장",
          "실증 성과의 제품화·시장확산 가속"
        ]
      }),
      createProject({
        id: "ondevice-expansion",
        name: "온디바이스 AI 서비스 실증·확산",
        budget: 24000,
        target: "지자체 등 비영리기관 및 ICT·AI 기업 컨소시엄",
        stage: "온디바이스 실증",
        source: "2026년 NIPA 통합 사업설명회 발표자료, 2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "국산 NPU와 디바이스, AI서비스 기업의 협업을 통해 온디바이스 AI 서비스 모델을 발굴하고 공공분야 대규모 실증을 추진하는 사업입니다.",
        overview: [
          "국산 NPU 확산을 촉진하기 위해 공공영역을 중심으로 온디바이스 AI 서비스의 대규모 적용사례를 만드는 사업입니다.",
          "지자체 현안 해결과 연계해 재난, 치안, 안전 등 생활밀착형 영역에서 서비스 개발과 실증을 동시에 추진합니다."
        ],
        targetContent: [
          "지자체 등 비영리기관",
          "AI반도체 기업, 디바이스 기업, ICT·AI 서비스 기업으로 구성된 컨소시엄"
        ],
        scale: [
          "2026년 예산: 24,000백만원",
          "총 8개 과제",
          "계속과제 3개, 신규과제 5개",
          "과제당 최대 30억원 내외"
        ],
        support: [
          "국산 NPU, CCTV, 드론 등 디바이스와 AI서비스 기업 협업 기반 온디바이스 AI 구현 지원",
          "1차년도에는 데이터 수집, AI모델 최적화, 인프라 구축, 시제품 제작 등 서비스 개발 지원",
          "2차년도에는 도시 단위 대규모 실증과 안정화, 최적화 중심 지원",
          "부산 해양안전, 경남 산불경보, 경북 도시관제에서 시작한 모델을 통신, 제조, 금융, 헬스, 교육, 로봇, 가전 등으로 확대"
        ],
        schedule: [
          "1~2월 사업공고",
          "3월 협약체결",
          "3~12월 과제수행",
          "8월 중간점검",
          "12월 결과평가"
        ],
        effect: [
          "국민 체감형 공공 서비스 실증 사례 창출",
          "국산 NPU의 공공영역 적용 확산",
          "지역 주력산업과 연계된 온디바이스 AI 수요 확대"
        ]
      }),
      createProject({
        id: "ax-sprint",
        name: "AI 엔드프로덕트 상용화 지원(AX 스프린트)",
        budget: 25500,
        target: "기존 제품·서비스의 AX 전환 또는 신규개발을 희망하는 기업 및 수요기관",
        stage: "상용화 지원",
        source: "2026년 NIPA 통합 사업설명회 발표자료, 2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "생활·안전 분야 중심으로 AI 서비스와 응용제품의 신속한 상용화와 AX 전환을 지원하는 사업입니다.",
        overview: [
          "생활·안전 분야의 AX 전환 촉진을 위해 AI 서비스 개발 기업과 응용제품 기업의 상용화·개발을 신속하게 지원하는 사업입니다.",
          "기존 제품과 서비스의 AX 전환부터 파급력 높은 신규 제품·서비스 개발까지 전주기 상용화를 목표로 합니다."
        ],
        targetContent: [
          "기존 제품 및 서비스의 AX 전환을 희망하는 기업",
          "신규 AI 제품·서비스 개발을 추진하는 기업 및 수요기관"
        ],
        scale: [
          "2026년 예산: 25,500백만원",
          "총 11개 과제",
          "즉시전환 6개 과제, 과제당 최대 30억원 내외, 1년 지원",
          "신속개발 5개 과제, 과제당 최대 15억원 내외, 2년 지원"
        ],
        support: [
          "즉시전환 트랙: AI 바디캠, AI 글래스, 구급차 호출 등 기존 제품·서비스의 AX 전환 지원",
          "신속개발 트랙: 제조, 금융 등 시장 확산 파급력이 높은 AI 제품·서비스 신규개발 지원",
          "AX 시제품 제작과 산업·시장 연계를 통해 개발, 상용화, 확산까지 이어지는 전주기 지원",
          "국산 NPU 활용 확대와 국민생활 밀착형 AI 제품·서비스 확산 촉진"
        ],
        schedule: [
          "2~3월 사업공고",
          "3월 협약체결",
          "4~11월 과제수행",
          "8월 중간점검",
          "12월 결과평가"
        ],
        effect: [
          "국민 체감형 AX 확산 가속",
          "국산 NPU 활용 수요 확대",
          "제품·서비스 신규개발과 시장진입 확대"
        ]
      }),
      createProject({
        id: "ax-validation",
        name: "AX 실증지원",
        budget: 16000,
        target: "AI반도체사, AI서비스 기업 컨소시엄",
        stage: "AX 실증",
        source: "2026년 NIPA 통합 사업설명회 발표자료, 2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "상용화된 AI서비스를 GPU 기반에서 국산 NPU 기반으로 전환해 실제 운영환경 실증을 지원하는 사업입니다.",
        overview: [
          "상용화된 AI서비스를 대상으로 GPU 기반 인프라를 국산 NPU 기반으로 전환하고 실제 운영환경에서 검증하는 사업입니다.",
          "의료, 농업, 에너지, 도시 등 주요 분야에서 국산 NPU의 적용성과 확산 가능성을 확보하는 데 초점을 둡니다."
        ],
        targetContent: [
          "AI반도체사와 AI서비스 기업으로 구성된 컨소시엄",
          "상용 AI서비스의 NPU 전환을 추진하는 주체"
        ],
        scale: [
          "2026년 예산: 16,000백만원",
          "총 4개 과제",
          "과제당 최대 40억원 내외"
        ],
        support: [
          "실증·검증: 상용화된 AI서비스를 GPU 기반에서 국산 NPU 기반으로 전환해 동일 운영환경에서 안정성·성능 검증",
          "시장확산: AI반도체-서비스-디바이스를 아우르는 통합 솔루션과 사업화 모델 마련",
          "의료, 농업, 에너지, 도시 등 주요 분야별 현장 실증 수행",
          "GPU 대비 우위와 적용 가능성을 입증할 수 있도록 성능 피드백과 검증 기반 제공"
        ],
        schedule: [
          "2~3월 사업공고",
          "4월 협약",
          "4~12월 과제수행",
          "8월 중간점검",
          "12월 결과평가"
        ],
        effect: [
          "국산 NPU 적용성과 입증",
          "서비스·디바이스·반도체 협업 모델 구축",
          "시장 확산과 글로벌 진출 기반 확보"
        ]
      })
    ]
  },
  {
    id: "global",
    title: "글로벌 진출",
    focus: "해외 PoC, 해외 레퍼런스, 패키지형 진출",
    budget: 21600,
    summary: "국산 NPU와 AI서비스의 동반 해외 실증과 레퍼런스 확보를 지원하는 영역입니다.",
    projects: [
      createProject({
        id: "global-poc",
        name: "AI반도체 해외실증 지원",
        budget: 21600,
        target: "AI반도체 및 서비스 기업",
        stage: "해외 PoC",
        source: "2026년 NIPA 통합 사업설명회 발표자료, 2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "AI반도체와 AI서비스 기업이 함께 해외 실증 레퍼런스를 확보할 수 있도록 지원하는 사업입니다.",
        overview: [
          "국산 NPU와 AI서비스를 패키지형으로 묶어 해외 수요처에서 실증하고 레퍼런스를 확보하도록 지원하는 사업입니다.",
          "아시아·태평양 지역을 중심으로 유럽·중동까지 확장을 추진하는 글로벌 진출형 사업입니다."
        ],
        targetContent: [
          "국내 AI반도체 기업",
          "국내 AI서비스 기업"
        ],
        scale: [
          "2026년 예산: 21,600백만원",
          "지원국가 확대: 8개국 → 16개국"
        ],
        support: [
          "해외 수요처 대상 PoC 수행과 현지 진출 연계 지원",
          "서버향 NPU와 엣지향 NPU를 AI서비스와 함께 패키지화해 해외 실증 추진",
          "글로벌 빅테크, 해외 거점, 현지 파트너와 연계한 레퍼런스 확보",
          "기존 8개국에서 16개국으로 확장하는 해외 실증 네트워크 활용"
        ],
        schedule: [
          "연중 자유공모 추진",
          "해외 수요처 발굴과 실증 병행"
        ],
        effect: [
          "해외 레퍼런스 확대",
          "국산 NPU 글로벌 시장 진입 가속",
          "서비스-반도체 동반 진출 모델 정착"
        ]
      })
    ]
  },
  {
    id: "talent",
    title: "인재·생태계",
    focus: "전문인력 공급, 기업 활용 지원",
    budget: 2250,
    summary: "AI반도체 기업이 즉시 활용 가능한 인력을 공급하고 산업 기반을 보강하는 영역입니다.",
    projects: [
      createProject({
        id: "talent-platform",
        name: "AI반도체 기술인재 공급 플랫폼",
        budget: 2250,
        target: "국내 AI반도체 관련 기업",
        stage: "생태계 조성",
        source: "2026년 예산 및 기금운용계획 사업설명자료, 2026년 NIPA 통합 사업설명회 발표자료, 2026년 AI반도체지원본부 국산 NPU 지원계획",
        description: "국내외 인재 공급체계를 구축해 AI반도체 기업이 즉시 활용 가능한 인력을 지원하는 사업입니다.",
        overview: [
          "AI반도체 기업이 겪는 기술인력 부족 문제를 완화하기 위해 필요한 인재를 발굴하고 연결하는 사업입니다.",
          "기존 경진대회 중심 인재 발굴의 한계를 보완해 전문인력 관리기관, 헤드헌트, 채용솔루션과 연계하는 방향이 강조됩니다."
        ],
        targetContent: [
          "서버, 엣지, 모바일, 설계 등 국내 AI반도체 관련 기업",
          "우수인재 채용연계를 희망하는 기업"
        ],
        scale: [
          "2026년 예산: 2,250백만원",
          "총 10개 기업 대상",
          "기업당 최대 1.5억원 내외 / 최대 2년"
        ],
        support: [
          "우수인재 발굴, 역량진단, 기업 요구사항 비교분석을 통한 맞춤형 인재 추천",
          "전문인력 관리기관, 헤드헌트, 채용솔루션 연계 기반 채용 매칭 지원",
          "기업이 채용한 인재의 인건비 지원과 고용유지 후속관리 제공",
          "기업 맞춤형 인재 DB 구축과 인재 관리 체계 운영"
        ],
        schedule: [
          "2~3월 사업공고",
          "4월 협약",
          "4~12월 과제수행",
          "8월 중간점검",
          "12월 결과평가"
        ],
        effect: [
          "즉시 활용 가능한 인재 확보 지원",
          "기술·인력난 완화",
          "채용 이후 고용유지까지 이어지는 지속형 지원체계 구축"
        ]
      })
    ]
  }
];

const announcementLinksByProjectId = {
  "k-npu-alliance": [],
  "public-procurement": [],
  "timely-support": [
    {
      label: "AI반도체 사업화 적시지원 사업소개",
      description: "NIPA 공식 사업소개 화면에서 사업 개요와 연계 공고 정보를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/nttDetail?bbsNo=4&bsnsDtlsIemNo=858&nttNo=16492&tab=2"
    },
    {
      label: "2026년 AI반도체 시제품 제작지원 공고",
      description: "AI반도체 사업화 적시지원의 직접 연계 공고입니다.",
      href: "https://www.nipa.kr/home/2-2/16492"
    }
  ],
  "design-optimization": [
    {
      label: "AI반도체 최적화 설계지원 사업소개",
      description: "NIPA 공식 사업소개 화면에서 사업 개요와 지원 구조를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/detail?bsnsDtlsIemNo=836"
    }
  ],
  "infra-upgrade": [
    {
      label: "AI반도체 조기 상용화 및 AX실증 지원 사업소개",
      description: "NIPA 공식 사업소개 화면에서 통합 사업 구조와 세부 지원 분야를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/detail?bsnsDtlsIemNo=823"
    }
  ],
  "application-poc": [
    {
      label: "AI반도체 응용실증지원 사업소개",
      description: "NIPA 공식 사업소개 화면에서 사업 목적과 지원 구조를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/detail?bsnsDtlsIemNo=638"
    }
  ],
  "early-commercialization": [
    {
      label: "AI반도체 조기 상용화 및 AX실증 지원 사업소개",
      description: "NIPA 공식 사업소개 화면에서 조기 상용화 지원의 전체 구조를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/detail?bsnsDtlsIemNo=823"
    }
  ],
  "ax-device": [
    {
      label: "국산 AI반도체 기반 AX디바이스 개발실증 사업소개",
      description: "NIPA 공식 사업소개 화면에서 사업 개요와 추진 구조를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/detail?bsnsDtlsIemNo=826"
    },
    {
      label: "2026년 AX디바이스 개발·실증 정규트랙 공고",
      description: "AX디바이스 개발·실증 정규트랙 신규과제 운영기관 모집 공고입니다.",
      href: "https://www.nipa.kr/home/2-2/16539"
    },
    {
      label: "2026년 AX디바이스 개발·실증 미니트랙 공고",
      description: "AX디바이스 개발·실증 미니트랙 사업 공고입니다.",
      href: "https://www.nipa.kr/home/2-2/16491"
    }
  ],
  "ondevice-expansion": [
    {
      label: "온디바이스AI서비스 실증·확산 사업소개",
      description: "NIPA 공식 사업소개 화면에서 사업 개요와 실증 구조를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/detail?bsnsDtlsIemNo=805"
    },
    {
      label: "2026년 온디바이스 AI 서비스 실증·확산 공고",
      description: "온디바이스 AI 서비스 실증·확산 신규과제 모집 공고입니다.",
      href: "https://www.nipa.kr/home/2-2/16598"
    }
  ],
  "ax-sprint": [
    {
      label: "AI 엔드프로덕트 상용화 지원 Type 1 사업소개",
      description: "NIPA 공식 사업소개 화면에서 Type 1의 사업 개요를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/3/nttDetail?bbsNo=4&bsnsDtlsIemNo=&nttNo=16471&tab=2"
    },
    {
      label: "AI 엔드프로덕트 상용화 지원 Type 2 사업소개",
      description: "NIPA 공식 사업소개 화면에서 Type 2의 사업 개요를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/6/nttDetail?bbsNo=4&bsnsDtlsIemNo=&nttNo=16475&tab=2"
    },
    {
      label: "2026년 AI 엔드프로덕트 상용화 지원 Type 1 공고",
      description: "공공AX 프로젝트 신규과제 모집 공고입니다.",
      href: "https://www.nipa.kr/home/2-2/16471"
    },
    {
      label: "2026년 AI 엔드프로덕트 상용화 지원 Type 2 공고",
      description: "AI 민생 프로젝트 유형의 신규과제 모집 공고입니다.",
      href: "https://www.nipa.kr/home/2-2/16475"
    }
  ],
  "ax-validation": [
    {
      label: "AX 실증지원 사업소개",
      description: "NIPA 공식 사업소개 화면에서 AX 실증지원의 사업 개요를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/detail?bsnsDtlsIemNo=816"
    }
  ],
  "global-poc": [
    {
      label: "AI-반도체 해외실증 지원 사업소개",
      description: "NIPA 공식 사업소개 화면에서 해외실증 지원의 사업 범위를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/detail?bsnsDtlsIemNo=815"
    },
    {
      label: "2026년 AI-반도체 해외실증 지원 공고(서버형)",
      description: "국산 AI반도체 기반 해외 서버 실증을 위한 2026 공고입니다.",
      href: "https://www.nipa.kr/home/2-2/16494"
    },
    {
      label: "2026년 AI-반도체 해외실증 지원 공고(엣지형)",
      description: "국산 AI반도체 기반 해외 엣지형 실증을 위한 2026 공고입니다.",
      href: "https://www.nipa.kr/home/2-2/16493"
    }
  ],
  "talent-platform": [
    {
      label: "AI반도체 기술인재 공급 플랫폼 사업소개",
      description: "NIPA 공식 사업소개 화면에서 채용연계와 지원 구조를 확인할 수 있습니다.",
      href: "https://www.nipa.kr/home/bsnsAll/0/detail?bsnsDtlsIemNo=747"
    }
  ]
};

function createProject({
  id,
  name,
  budget,
  target,
  stage,
  source,
  description,
  overview,
  targetContent,
  scale,
  support,
  schedule,
  effect
}) {
  return {
    id,
    name,
    budget,
    target,
    stage,
    source,
    description,
    tabs: [
      { id: "overview", label: "사업개요", content: overview },
      { id: "target", label: "지원대상", content: targetContent },
      { id: "scale", label: "지원규모", content: scale },
      { id: "support", label: "지원내용", content: support },
      { id: "schedule", label: "추진절차", content: schedule },
      { id: "effect", label: "기대효과", content: effect }
    ]
  };
}

const state = {
  selectedValueChainId: null,
  selectedProjectId: "k-npu-alliance",
  selectedTabId: "overview"
};

const elements = {
  valueChainGrid: document.querySelector("#valueChainGrid"),
  projectList: document.querySelector("#projectList"),
  selectedProjectCount: document.querySelector("#selectedProjectCount"),
  selectedBudgetTotal: document.querySelector("#selectedBudgetTotal"),
  totalProjectCount: document.querySelector("#totalProjectCount"),
  totalBudgetCount: document.querySelector("#totalBudgetCount"),
  selectedValueChainTitle: document.querySelector("#selectedValueChainTitle"),
  selectedValueChainSummary: document.querySelector("#selectedValueChainSummary"),
  showAllButton: document.querySelector("#showAllButton"),
  detailValueChain: document.querySelector("#detailValueChain"),
  detailProjectTitle: document.querySelector("#detailProjectTitle"),
  detailBudget: document.querySelector("#detailBudget"),
  detailMeta: document.querySelector("#detailMeta"),
  detailTabs: document.querySelector("#detailTabs"),
  detailPanel: document.querySelector("#detailPanel"),
  announcementLinks: document.querySelector("#announcementLinks")
};

function formatBudget(value) {
  return value === 0 ? "" : `${value.toLocaleString("ko-KR")}백만원`;
}

function getAllProjects() {
  return valueChains.flatMap((chain) =>
    chain.projects.map((project) => ({
      ...project,
      parentTitle: chain.title,
      parentId: chain.id
    }))
  );
}

function getSelectedValueChain() {
  return valueChains.find((chain) => chain.id === state.selectedValueChainId) || null;
}

function getVisibleProjects() {
  const selectedChain = getSelectedValueChain();
  return selectedChain
    ? selectedChain.projects.map((project) => ({
        ...project,
        parentTitle: selectedChain.title,
        parentId: selectedChain.id
      }))
    : getAllProjects();
}

function getSelectedProject() {
  return getAllProjects().find((project) => project.id === state.selectedProjectId) || getAllProjects()[0];
}

function renderValueChains() {
  elements.valueChainGrid.innerHTML = valueChains
    .map(
      (chain, index) => `
        <button class="value-chain-card ${chain.id === state.selectedValueChainId ? "is-active" : ""}" type="button" data-id="${chain.id}">
          <span class="card-index">${index + 1}</span>
          <h3>${chain.title}</h3>
          <div class="chip-row">
            <span class="chip">${chain.projects.length}개 사업</span>
            ${chain.budget > 0 ? `<span class="chip">${formatBudget(chain.budget)}</span>` : ""}
          </div>
          <p class="card-caption">${chain.focus}</p>
        </button>
      `
    )
    .join("");

  [...elements.valueChainGrid.querySelectorAll("[data-id]")].forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedValueChainId = button.dataset.id;
      const firstVisibleProject = getVisibleProjects()[0];
      if (firstVisibleProject) {
        state.selectedProjectId = firstVisibleProject.id;
        state.selectedTabId = "overview";
      }
      render();
    });
  });
}

function renderProjects() {
  const visibleProjects = getVisibleProjects();
  elements.projectList.innerHTML = visibleProjects
    .map(
      (project) => `
        <article class="project-card ${project.id === state.selectedProjectId ? "is-selected" : ""}">
          <div class="project-card-header">
            <div class="project-card-main">
              <div class="chip-row">
                <span class="chip">${project.parentTitle}</span>
                <span class="chip">${project.stage}</span>
                <span class="chip">${project.target}</span>
              </div>
              <button class="project-title-button" type="button" data-project-id="${project.id}">
                ${project.name}
              </button>
            </div>
            ${project.budget > 0 ? `<div class="budget-badge">${formatBudget(project.budget)}</div>` : ""}
          </div>
          <p class="project-description">${project.description}</p>
        </article>
      `
    )
    .join("");

  [...elements.projectList.querySelectorAll("[data-project-id]")].forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedProjectId = button.dataset.projectId;
      state.selectedTabId = "overview";
      render();
    });
  });
}

function renderSummary() {
  const selectedChain = getSelectedValueChain();
  const selectedProjects = getVisibleProjects();
  const selectedBudget = selectedChain
    ? selectedChain.budget
    : valueChains.reduce((sum, chain) => sum + chain.budget, 0);
  const totalProjects = getAllProjects();
  const totalBudget = valueChains.reduce((sum, chain) => sum + chain.budget, 0);

  elements.selectedProjectCount.textContent = `${selectedProjects.length}개`;
  elements.selectedBudgetTotal.textContent = formatBudget(selectedBudget);
  elements.totalProjectCount.textContent = `${totalProjects.length}개`;
  elements.totalBudgetCount.textContent = formatBudget(totalBudget);
  elements.selectedValueChainTitle.textContent = selectedChain ? selectedChain.title : "전체 사업 현황";
  elements.selectedValueChainSummary.textContent = selectedChain
    ? selectedChain.summary
    : "벨류체인과 사업명을 선택하면 우측 상세 탭에서 사업개요, 지원대상, 지원규모, 지원내용, 추진절차, 기대효과를 볼 수 있습니다.";
}

function renderProjectDetail() {
  const project = getSelectedProject();
  const selectedTab = project.tabs.find((tab) => tab.id === state.selectedTabId) || project.tabs[0];
  const announcementLinks = announcementLinksByProjectId[project.id] || [];

  elements.detailValueChain.textContent = project.parentTitle;
  elements.detailProjectTitle.textContent = project.name;
  elements.detailBudget.textContent = project.budget > 0 ? formatBudget(project.budget) : "";
  elements.detailBudget.classList.toggle("is-hidden", project.budget === 0);
  elements.detailMeta.innerHTML = `
    <span class="chip">${project.stage}</span>
    <span class="chip">${project.target}</span>
  `;

  elements.detailTabs.innerHTML = project.tabs
    .map(
      (tab) => `
        <button type="button" class="detail-tab ${tab.id === selectedTab.id ? "is-active" : ""}" data-tab-id="${tab.id}">
          ${tab.label}
        </button>
      `
    )
    .join("");

  elements.detailPanel.innerHTML = `
    <h4>${selectedTab.label}</h4>
    <ul class="detail-points">
      ${selectedTab.content.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;

  elements.announcementLinks.innerHTML = announcementLinks.length
    ? announcementLinks
        .map(
          (link) => `
            <a class="announcement-link" href="${link.href}" target="_blank" rel="noreferrer">
              <strong>${link.label}</strong>
              <span>${link.description}</span>
            </a>
          `
        )
        .join("")
    : `
        <div class="announcement-empty">
          현재 확인된 사업소개 또는 2026년 사업공고 링크가 없습니다.
        </div>
      `;

  [...elements.detailTabs.querySelectorAll("[data-tab-id]")].forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedTabId = button.dataset.tabId;
      renderProjectDetail();
    });
  });
}

function ensureSelection() {
  const visibleProjects = getVisibleProjects();
  if (!visibleProjects.some((project) => project.id === state.selectedProjectId)) {
    state.selectedProjectId = visibleProjects[0]?.id || getAllProjects()[0]?.id;
    state.selectedTabId = "overview";
  }
}

function render() {
  ensureSelection();
  renderValueChains();
  renderProjects();
  renderSummary();
  renderProjectDetail();
}

elements.showAllButton.addEventListener("click", () => {
  state.selectedValueChainId = null;
  state.selectedTabId = "overview";
  render();
});

render();
