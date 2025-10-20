import svgPaths from "./svg-7niet7ueol";

function Frame1410074606() {
  return (
    <div className="content-stretch flex font-['Urbanist:SemiBold',_sans-serif] font-semibold gap-[20px] items-center leading-[normal] relative shrink-0 text-[24px] text-center text-nowrap text-white w-full whitespace-pre">
      <p className="relative shrink-0">{`Categoria de Proyecto 1 `}</p>
      <p className="relative shrink-0">Categoria de Proyecto 2</p>
      <p className="relative shrink-0">Categoria de Proyecto 3</p>
    </div>
  );
}

function Frame1410074615() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[36px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="font-['Urbanist:ExtraBold',_sans-serif] font-extrabold leading-none relative shrink-0 text-[#d0df00] text-[120px] tracking-[-1.2px] uppercase w-full">
        <p className="mb-0">{`Nombre de `}</p>
        <p>proyecto</p>
      </div>
      <Frame1410074606 />
    </div>
  );
}

function Oc5() {
  return (
    <div className="basis-0 bg-[#1a1a1a] box-border content-stretch flex flex-col grow h-full items-center justify-center min-h-px min-w-px mix-blend-screen overflow-clip px-0 py-[13px] relative shrink-0" data-name="OC 5">
      <p className="font-['Titillium_Web:Regular',_sans-serif] leading-[1.1] min-w-full not-italic relative shrink-0 text-[64px] text-center text-white w-[min-content]">Banner Imagen</p>
      <div className="absolute inset-0 mix-blend-color-burn opacity-50" data-name="Noise" />
    </div>
  );
}

function Frame1410074616() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame1410074615 />
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <Oc5 />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full">
      <p className="basis-0 font-['Titillium_Web:SemiBold',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[32px] text-white">Descripción de proyecto</p>
    </div>
  );
}

function AngleDownSolid() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="angle-down-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="angle-down-solid">
          <path d={svgPaths.p3a677500} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ScrollDown() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] box-border content-stretch flex items-center justify-center p-[8px] relative rounded-[100px] shrink-0 w-[106px]" data-name="Scroll down">
      <AngleDownSolid />
    </div>
  );
}

function StripDeBannerdeProyecto() {
  return (
    <div className="relative shrink-0 w-full" data-name="Strip de BannerdeProyecto">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[50px] items-center justify-center px-[50px] py-[150px] relative w-full">
          <Frame1410074616 />
          <Frame9 />
          <ScrollDown />
        </div>
      </div>
    </div>
  );
}

function StripDeCasoDeEstudioDeProyecto() {
  return (
    <div className="relative shrink-0 w-full" data-name="Strip de Caso de Estudio de Proyecto">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[50px] items-start px-[50px] py-[100px] relative text-right w-full">
          <p className="font-['Urbanist:ExtraBold',_sans-serif] font-extrabold leading-none min-w-full relative shrink-0 text-[#d0df00] text-[120px] tracking-[-1.2px] uppercase w-[min-content]">Titulo de articulo</p>
          <p className="font-['Titillium_Web:SemiBold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[32px] text-white w-[1662px]">Articulo ó caso de estudio</p>
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow h-[500px] min-h-[500px] min-w-px relative rounded-[10px] shrink-0">
      <div className="flex flex-col items-center min-h-inherit size-full">
        <div className="box-border content-stretch flex flex-col h-[500px] items-center justify-between min-h-inherit px-[24px] py-[16px] relative w-full">
          <p className="font-['Titillium_Web:Regular',_sans-serif] leading-[1.1] not-italic relative shrink-0 text-[64px] text-center text-white w-full">Imagen de articulo</p>
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow h-[500px] min-h-[500px] min-w-px relative rounded-[10px] shrink-0">
      <div className="flex flex-col items-center min-h-inherit size-full">
        <div className="box-border content-stretch flex flex-col h-[500px] items-center justify-between min-h-inherit px-[24px] py-[16px] relative w-full">
          <p className="font-['Titillium_Web:Regular',_sans-serif] leading-[1.1] not-italic relative shrink-0 text-[64px] text-center text-white w-full">Imagen de articulo 2</p>
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame36 />
      <Frame39 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow h-[500px] min-h-[500px] min-w-px relative rounded-[10px] shrink-0">
      <div className="flex flex-col items-center min-h-inherit size-full">
        <div className="box-border content-stretch flex flex-col h-[500px] items-center justify-between min-h-inherit px-[24px] py-[16px] relative w-full">
          <p className="font-['Titillium_Web:Regular',_sans-serif] leading-[1.1] not-italic relative shrink-0 text-[64px] text-center text-white w-full">Imagen de articulo 3</p>
        </div>
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      {[...Array(2).keys()].map((_, i) => (
        <Frame37 key={i} />
      ))}
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame40 />
      <Frame41 />
    </div>
  );
}

function StripDeImages() {
  return (
    <div className="relative shrink-0 w-full" data-name="Strip de Images">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-[50px] py-0 relative w-full">
          <Frame43 />
        </div>
      </div>
    </div>
  );
}

function Group512436() {
  return (
    <div className="absolute h-[930px] left-[1763px] top-[-1417.36px] w-[899px]">
      <div className="absolute bottom-0 left-0 right-[-0.11%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 900 930">
          <g id="Group 512436">
            <g id="Line 47">
              <line stroke="url(#paint0_linear_1_112)" style={{ mixBlendMode: "screen" }} x1="899.5" x2="899.5" y1="-2.18557e-08" y2="930" />
            </g>
            <g id="Line 44">
              <line stroke="url(#paint1_linear_1_112)" style={{ mixBlendMode: "screen" }} x1="232.5" x2="232.5" y1="-2.18557e-08" y2="930" />
            </g>
            <g id="Line 45">
              <line stroke="url(#paint2_linear_1_112)" style={{ mixBlendMode: "screen" }} x1="451.5" x2="451.5" y1="-2.18557e-08" y2="930" />
            </g>
            <g id="Line 43">
              <line stroke="url(#paint3_linear_1_112)" style={{ mixBlendMode: "screen" }} x1="0.5" x2="0.500041" y1="-2.18557e-08" y2="930" />
            </g>
            <g id="Line 46">
              <line stroke="url(#paint4_linear_1_112)" style={{ mixBlendMode: "screen" }} x1="671.5" x2="671.5" y1="-2.18557e-08" y2="930" />
            </g>
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_112" x1="898.5" x2="898.5" y1="2.18557e-08" y2="930">
              <stop stopColor="#0D0D0D" />
              <stop offset="0.475" stopColor="#212121" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_112" x1="231.5" x2="231.5" y1="2.18557e-08" y2="930">
              <stop stopColor="#0D0D0D" />
              <stop offset="0.475" stopColor="#212121" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_112" x1="450.5" x2="450.5" y1="2.18557e-08" y2="930">
              <stop stopColor="#0D0D0D" />
              <stop offset="0.475" stopColor="#212121" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_1_112" x1="-0.5" x2="-0.499959" y1="2.18557e-08" y2="930">
              <stop stopColor="#0D0D0D" />
              <stop offset="0.475" stopColor="#212121" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint4_linear_1_112" x1="670.5" x2="670.5" y1="2.18557e-08" y2="930">
              <stop stopColor="#0D0D0D" />
              <stop offset="0.475" stopColor="#212121" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame82() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
      <p className="font-['Urbanist:ExtraBold',_sans-serif] font-extrabold leading-none min-w-full relative shrink-0 text-[120px] text-white tracking-[-1.2px] uppercase w-[min-content]">Los servicios que ofrecimos:</p>
      <Group512436 />
    </div>
  );
}

function ArrowInsert() {
  return (
    <div className="relative size-full" data-name="arrow_insert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="arrow_insert">
          <path d={svgPaths.pd69a00} fill="var(--fill-0, white)" id="arrow_insert_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1410074533() {
  return (
    <div className="bg-neutral-950 relative rounded-[9.663px] shrink-0 size-[52.179px]">
      <div className="absolute flex inset-[27.08%_31.25%_31.25%_27.08%] items-center justify-center">
        <div className="flex-none rotate-[180deg] scale-y-[-100%] size-[21.741px]">
          <ArrowInsert />
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="box-border content-stretch flex gap-[16.199px] items-center justify-center p-[10px] relative rounded-[7.73px] shrink-0 size-[77px]" data-name="Button">
      <Frame1410074533 />
    </div>
  );
}

function Frame1410074482() {
  return (
    <div className="box-border content-stretch flex h-[250px] items-start justify-between overflow-clip px-[20px] py-[50px] relative rounded-[10px] shrink-0 w-[1662px]" style={{ backgroundImage: "linear-gradient(13.0968deg, rgb(18, 18, 18) 17.562%, rgb(22, 22, 22) 17.567%), linear-gradient(90deg, rgb(22, 22, 22) 0%, rgb(22, 22, 22) 100%)" }}>
      <p className="font-['Urbanist:Regular',_sans-serif] font-normal leading-none relative shrink-0 text-[#d0df00] text-[150px] w-[1121px]">Servicio 1</p>
      <Button />
    </div>
  );
}

function ArrowInsert1() {
  return (
    <div className="relative size-full" data-name="arrow_insert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="arrow_insert">
          <path d={svgPaths.pd69a00} fill="var(--fill-0, white)" id="arrow_insert_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1410074534() {
  return (
    <div className="bg-neutral-950 relative rounded-[9.663px] shrink-0 size-[52.179px]">
      <div className="absolute flex inset-[27.08%_31.25%_31.25%_27.08%] items-center justify-center">
        <div className="flex-none rotate-[180deg] scale-y-[-100%] size-[21.741px]">
          <ArrowInsert1 />
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="box-border content-stretch flex gap-[16.199px] items-center justify-center p-[10px] relative rounded-[7.73px] shrink-0 size-[77px]" data-name="Button">
      <Frame1410074534 />
    </div>
  );
}

function Frame1410074487() {
  return (
    <div className="box-border content-stretch flex h-[250px] items-start justify-between overflow-clip px-[20px] py-[50px] relative rounded-[10px] shrink-0 w-[1662px]" style={{ backgroundImage: "linear-gradient(13.0968deg, rgb(18, 18, 18) 17.562%, rgb(22, 22, 22) 17.567%), linear-gradient(90deg, rgb(22, 22, 22) 0%, rgb(22, 22, 22) 100%)" }}>
      <p className="font-['Urbanist:Regular',_sans-serif] font-normal leading-none relative shrink-0 text-[#d0df00] text-[150px] w-[1121px]">Servicio 2</p>
      <Button1 />
    </div>
  );
}

function ArrowInsert2() {
  return (
    <div className="relative size-full" data-name="arrow_insert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="arrow_insert">
          <path d={svgPaths.pd69a00} fill="var(--fill-0, white)" id="arrow_insert_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1410074535() {
  return (
    <div className="bg-neutral-950 relative rounded-[9.663px] shrink-0 size-[52.179px]">
      <div className="absolute flex inset-[27.08%_31.25%_31.25%_27.08%] items-center justify-center">
        <div className="flex-none rotate-[180deg] scale-y-[-100%] size-[21.741px]">
          <ArrowInsert2 />
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="box-border content-stretch flex gap-[16.199px] items-center justify-center p-[10px] relative rounded-[7.73px] shrink-0 size-[77px]" data-name="Button">
      <Frame1410074535 />
    </div>
  );
}

function Frame1410074490() {
  return (
    <div className="box-border content-stretch flex h-[250px] items-start justify-between overflow-clip px-[20px] py-[50px] relative rounded-[10px] shrink-0 w-[1662px]" style={{ backgroundImage: "linear-gradient(13.0968deg, rgb(18, 18, 18) 17.562%, rgb(22, 22, 22) 17.567%), linear-gradient(90deg, rgb(22, 22, 22) 0%, rgb(22, 22, 22) 100%)" }}>
      <p className="font-['Urbanist:Regular',_sans-serif] font-normal leading-none relative shrink-0 text-[#d0df00] text-[150px] w-[1121px]">Servicio 3</p>
      <Button2 />
    </div>
  );
}

function ArrowInsert3() {
  return (
    <div className="relative size-full" data-name="arrow_insert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="arrow_insert">
          <path d={svgPaths.pd69a00} fill="var(--fill-0, white)" id="arrow_insert_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1410074536() {
  return (
    <div className="bg-neutral-950 relative rounded-[9.663px] shrink-0 size-[52.179px]">
      <div className="absolute flex inset-[27.08%_31.25%_31.25%_27.08%] items-center justify-center">
        <div className="flex-none rotate-[180deg] scale-y-[-100%] size-[21.741px]">
          <ArrowInsert3 />
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="box-border content-stretch flex gap-[16.199px] items-center justify-center p-[10px] relative rounded-[7.73px] shrink-0 size-[77px]" data-name="Button">
      <Frame1410074536 />
    </div>
  );
}

function Frame1410074488() {
  return (
    <div className="box-border content-stretch flex h-[250px] items-start justify-between overflow-clip px-[20px] py-[50px] relative rounded-[10px] shrink-0 w-[1662px]" style={{ backgroundImage: "linear-gradient(13.0968deg, rgb(18, 18, 18) 17.562%, rgb(22, 22, 22) 17.567%), linear-gradient(90deg, rgb(22, 22, 22) 0%, rgb(22, 22, 22) 100%)" }}>
      <p className="font-['Urbanist:Regular',_sans-serif] font-normal leading-none relative shrink-0 text-[#d0df00] text-[150px] w-[1121px]">Servicio 4</p>
      <Button3 />
    </div>
  );
}

function ArrowInsert4() {
  return (
    <div className="relative size-full" data-name="arrow_insert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="arrow_insert">
          <path d={svgPaths.pd69a00} fill="var(--fill-0, white)" id="arrow_insert_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1410074537() {
  return (
    <div className="bg-neutral-950 relative rounded-[9.663px] shrink-0 size-[52.179px]">
      <div className="absolute flex inset-[27.08%_31.25%_31.25%_27.08%] items-center justify-center">
        <div className="flex-none rotate-[180deg] scale-y-[-100%] size-[21.741px]">
          <ArrowInsert4 />
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="box-border content-stretch flex gap-[16.199px] items-center justify-center p-[10px] relative rounded-[7.73px] shrink-0 size-[77px]" data-name="Button">
      <Frame1410074537 />
    </div>
  );
}

function Frame1410074489() {
  return (
    <div className="box-border content-stretch flex h-[250px] items-start justify-between overflow-clip px-[20px] py-[50px] relative rounded-[10px] shrink-0 w-[1662px]" style={{ backgroundImage: "linear-gradient(13.0968deg, rgb(18, 18, 18) 17.562%, rgb(22, 22, 22) 17.567%), linear-gradient(90deg, rgb(22, 22, 22) 0%, rgb(22, 22, 22) 100%)" }}>
      <p className="font-['Urbanist:Regular',_sans-serif] font-normal leading-none relative shrink-0 text-[#d0df00] text-[150px] w-[1121px]">Servicio 5</p>
      <Button4 />
    </div>
  );
}

function Frame1410074617() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[100px] items-start px-0 py-[50px] relative shrink-0">
      <Frame1410074482 />
      <Frame1410074487 />
      <Frame1410074490 />
      <Frame1410074488 />
      <Frame1410074489 />
    </div>
  );
}

function StripDeServicios() {
  return (
    <div className="relative shrink-0 w-full" data-name="Strip de Servicios">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[56px] items-center px-[50px] py-[150px] relative w-full">
          <Frame82 />
          <Frame1410074617 />
        </div>
      </div>
    </div>
  );
}

function StripDeAprendizaje() {
  return (
    <div className="relative shrink-0 w-full" data-name="Strip de Aprendizaje">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[50px] items-start px-[50px] py-[100px] relative text-right text-white w-full">
          <p className="font-['Urbanist:ExtraBold',_sans-serif] font-extrabold leading-none min-w-full relative shrink-0 text-[120px] tracking-[-1.2px] uppercase w-[min-content]">Nuestro aprendizaje</p>
          <p className="font-['Titillium_Web:SemiBold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[32px] w-[1662px]">Aprendizajes clave del proyecto</p>
        </div>
      </div>
    </div>
  );
}

export default function Main() {
  return (
    <div className="relative size-full" data-name="Main" style={{ backgroundImage: "linear-gradient(202.06deg, rgb(0, 0, 0) 32.72%, rgba(0, 0, 0, 0.5) 42.552%, rgba(0, 0, 0, 0.5) 63.197%, rgb(0, 0, 0) 80.9%), linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%)" }}>
      <div className="content-stretch flex flex-col gap-[10px] items-center relative size-full">
        <StripDeBannerdeProyecto />
        <StripDeCasoDeEstudioDeProyecto />
        <StripDeImages />
        <StripDeServicios />
        <StripDeAprendizaje />
      </div>
      <div aria-hidden="true" className="absolute border border-[#0d0d0d] border-solid inset-[-0.5px] pointer-events-none" />
    </div>
  );
}